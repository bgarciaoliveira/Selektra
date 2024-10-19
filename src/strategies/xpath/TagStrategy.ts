// src/strategies/xpath/TagStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';

/**
 * A strategy for generating XPath selectors based on the tag name of an element.
 */
export class TagStrategy implements Strategy {
  /**
   * Creates an instance of TagStrategy.
   * @param options - An object containing a function to validate tag names.
   */
  constructor(private options: { tagName: (tagName: string) => boolean }) {}

  /**
   * Generates a selector part for the given element if the tag name matches the criteria.
   * @param element - The DOM element for which to generate the selector part.
   * @returns A SelectorPart object with the tag name and a penalty, or null if the tag name does not match.
   */
  public generate(element: Element): SelectorPart | null {
    const tagName = element.tagName.toLowerCase();

    if (this.options.tagName(tagName)) {
      return {
        name: tagName,
        penalty: 2,
      };
    }

    return null;
  }
}
