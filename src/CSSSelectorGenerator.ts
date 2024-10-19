// src/CSSSelectorGenerator.ts

import { Options, SelectorPart } from './types';
import { Strategy } from './strategies/Strategy';
import {
  IdStrategy,
  ClassStrategy,
  AttributeStrategy,
  TagStrategy,
  NthChildStrategy,
} from './strategies/css';
import { CssUtils, DomUtils, Logger } from './utils';

/**
 * Generates a unique CSS selector for a given DOM element.
 */
export class CSSSelectorGenerator {
  private options: Options;
  private strategies: Strategy[];
  private rootDocument: Document | Element;
  private startTime: number;
  private uniquenessCache: Map<string, boolean> = new Map();
  private targetElement!: Element;
  private logger: Logger;

  /**
   * Constructs an instance of CSSSelectorGenerator with the specified options.
   * @param options Partial options to customize the behavior of the selector generator.
   */
  constructor(options?: Partial<Options>) {
    const defaultOptions: Options = {
      root: document.body,
      idName: () => true,
      className: () => true,
      tagName: () => true,
      attr: () => false,
      seedMinLength: 1,
      optimizedMinLength: 2,
      maxCandidates: 1000,
      maxCombinations: 10000,
      timeoutMs: undefined,
      maxDepth: undefined,
      debug: false, // Added debug option
    };

    this.options = { ...defaultOptions, ...options };
    this.logger = new Logger(this.options.debug);
    this.rootDocument = DomUtils.findRootDocument(this.options.root);
    this.startTime = Date.now();

    this.strategies = [
      new IdStrategy(this.options),
      new AttributeStrategy(this.options),
      new ClassStrategy(this.options),
      new TagStrategy(this.options),
      new NthChildStrategy(),
    ];
  }

  /**
   * Generates a unique CSS selector for the provided element.
   * @param element The DOM element for which to generate a selector.
   * @returns A unique CSS selector string.
   * @throws Will throw an error if a unique selector cannot be generated.
   */
  public generate(element: Element): string {
    if (element.nodeType !== Node.ELEMENT_NODE) {
      this.logger.log(`Invalid node type: ${element.nodeType}`);
      throw new Error("Cannot generate selector for non-element nodes.");
    }

    if (element.tagName.toLowerCase() === 'html') {
      this.logger.log('Element is <html>, returning "html" as selector.');
      return 'html';
    }

    this.targetElement = element;
    this.logger.log(`Starting selector generation for element: ${element.tagName.toLowerCase()}`);

    const path = this.buildPath(element);
    this.logger.log(`Initial path: ${JSON.stringify(path.map(p => p.name))}`);

    const optimizedPath = this.optimizePath(path, element);
    this.logger.log(`Optimized path: ${JSON.stringify(optimizedPath.map(p => p.name))}`);

    const selector = CssUtils.buildSelector(optimizedPath);
    this.logger.log(`Generated selector: ${selector}`);

    return selector;
  }

  /**
   * Builds the initial selector path by traversing from the element up to the root.
   * @param element The starting element for path building.
   * @returns An array of SelectorPart objects representing the selector path.
   */
  private buildPath(element: Element): SelectorPart[] {
    let currentElement: Element | null = element;
    const path: SelectorPart[] = [];
    let depth = 0;

    while (currentElement && currentElement !== this.options.root.parentElement) {
      this.checkTimeout();

      if (this.options.maxDepth !== undefined && depth > this.options.maxDepth) {
        this.logger.log(
          `Max depth of ${this.options.maxDepth} reached at element: ${currentElement.tagName.toLowerCase()}`
        );
        break;
      }

      this.logger.log(`Applying strategies at depth ${depth} for element: ${currentElement.tagName.toLowerCase()}`);

      const parts = this.applyStrategies(currentElement);
      if (parts.length > 0) {
        const part = parts[0];
        this.logger.log(`Strategy found part: ${part.name}`);
        path.unshift(part);

        if (this.isUnique(path)) {
          this.logger.log(`Unique path found: ${CssUtils.buildSelector(path)}`);
          return path;
        }
      } else {
        this.logger.log(`No strategies could generate a part for element: ${currentElement.tagName.toLowerCase()}`);
        const wildcardPart: SelectorPart = {
          name: '*',
          penalty: 3,
          level: DomUtils.getElementLevel(currentElement, this.options.root),
        };
        path.unshift(wildcardPart);
      }

      currentElement = currentElement.parentElement;
      depth++;
    }

    if (this.isUnique(path)) {
      this.logger.log(`Unique path found after traversal: ${CssUtils.buildSelector(path)}`);
      return path;
    }

    this.logger.log('Unable to generate a unique selector after full traversal.');
    throw new Error("Unable to generate a unique selector.");
  }

  /**
   * Applies the configured strategies to generate selector parts for the given element.
   * @param element The element to process with strategies.
   * @returns An array of SelectorPart objects generated by the strategies.
   */
  private applyStrategies(element: Element): SelectorPart[] {
    const parts: SelectorPart[] = [];

    for (const strategy of this.strategies) {
      const result = strategy.generate(element);
      if (result) {
        result.level = DomUtils.getElementLevel(element, this.options.root);
        this.logger.log(`Strategy ${strategy.constructor.name} generated part: ${result.name}`);
        parts.push(result);
        break;
      }
    }

    if (parts.length === 0) {
      this.logger.log(`No strategies could generate a part for element: ${element.tagName.toLowerCase()}`);
    }

    return parts;
  }

  /**
   * Optimizes the selector path by removing redundant parts while ensuring the selector remains unique.
   * @param path The initial selector path to optimize.
   * @param element The target element for which the selector is generated.
   * @returns The optimized selector path.
   */
  private optimizePath(path: SelectorPart[], element: Element): SelectorPart[] {
    if (path.length <= this.options.optimizedMinLength) {
      this.logger.log('Path length is less than or equal to optimizedMinLength; skipping optimization.');
      return path;
    }

    let optimizedPath = path.slice();

    this.logger.log(`Starting optimization with path: ${JSON.stringify(optimizedPath.map(p => p.name))}`);

    // Sort parts by penalty in descending order
    optimizedPath.sort((a, b) => b.penalty - a.penalty);

    for (let i = 0; i < optimizedPath.length - 1; i++) {
      this.checkTimeout();

      const testPath = optimizedPath.slice();
      const removedPart = testPath.splice(i, 1)[0];

      this.logger.log(`Testing path without part "${removedPart.name}": ${JSON.stringify(testPath.map(p => p.name))}`);

      if (this.isUnique(testPath) && DomUtils.matches(element, CssUtils.buildSelector(testPath), this.rootDocument)) {
        this.logger.log(`Path is still unique without "${removedPart.name}". Removing it.`);
        optimizedPath = testPath;
        i--; // Adjust index after removal
      } else {
        this.logger.log(`Path without "${removedPart.name}" is not unique. Keeping it.`);
      }
    }

    // Restore original order based on levels
    optimizedPath.sort((a, b) => a.level! - b.level!);

    this.logger.log(`Optimization complete. Optimized path: ${JSON.stringify(optimizedPath.map(p => p.name))}`);

    return optimizedPath;
  }

  /**
   * Determines if the provided selector path uniquely identifies the target element.
   * @param path The selector path to test.
   * @returns True if the selector is unique; otherwise, false.
   */
  private isUnique(path: SelectorPart[]): boolean {
    const selector = CssUtils.buildSelector(path);

    if (this.uniquenessCache.has(selector)) {
      const cachedResult = this.uniquenessCache.get(selector)!;
      this.logger.log(`Selector "${selector}" uniqueness retrieved from cache: ${cachedResult}`);
      return cachedResult;
    }

    const elements = this.rootDocument.querySelectorAll(selector);
    const isUnique = elements.length === 1 && elements[0] === this.targetElement;

    this.logger.log(`Selector "${selector}" matches ${elements.length} elements. Is unique: ${isUnique}`);

    this.uniquenessCache.set(selector, isUnique);
    return isUnique;
  }

  /**
   * Checks if the operation has exceeded the specified timeout duration.
   * @throws Will throw an error if the timeout has been exceeded.
   */
  private checkTimeout(): void {
    if (this.options.timeoutMs !== undefined) {
      const elapsedTime = Date.now() - this.startTime;
      if (elapsedTime > this.options.timeoutMs) {
        this.logger.log(`Timeout of ${this.options.timeoutMs}ms exceeded.`);
        throw new Error(`Timeout: Unable to generate selector within ${this.options.timeoutMs}ms.`);
      }
    }
  }
}