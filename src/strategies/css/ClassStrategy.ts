// src/strategies/css/ClassStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';
import { CssUtils } from '../../utils/CssUtils';

/**
 * ClassStrategy is a strategy for generating CSS selectors based on class names.
 * It implements the Strategy interface.
 */
export class ClassStrategy implements Strategy {
  /**
   * Creates an instance of ClassStrategy.
   * @param options - An object containing a function to filter class names.
   */
  constructor(private options: { className: (className: string) => boolean }) {}

  /**
   * Generates a CSS selector part for the given element based on its class names.
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object containing the selector name and penalty, or null if no valid class name is found.
   */
  public generate(element: Element): SelectorPart | null {
    const classList = Array.from(element.classList).filter(this.options.className);

    if (classList.length > 0) {
      const className = classList[0];
      const escapedClassName = CssUtils.escape(className);
      return {
        name: `.${escapedClassName}`,
        penalty: 1,
      };
    }

    return null;
  }
}
