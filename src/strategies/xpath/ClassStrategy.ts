// src/strategies/xpath/ClassStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';

/**
 * ClassStrategy is responsible for generating XPath selectors based on the class attribute of an element.
 */
export class ClassStrategy implements Strategy {
  /**
   * Creates an instance of ClassStrategy.
   * @param options - An object containing a function to filter class names.
   */
  constructor(private options: { className: (className: string) => boolean }) {}

  /**
   * Generates an XPath selector part for the given element based on its class attribute.
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object containing the XPath selector and its penalty, or null if no valid class is found.
   */
  public generate(element: Element): SelectorPart | null {
    const classList = Array.from(element.classList).filter(this.options.className);

    if (classList.length > 0) {
      const className = classList[0].replace(/"/g, '\\"');
      return {
        name: `*[contains(concat(' ', normalize-space(@class), ' '), ' ${className} ')]`,
        penalty: 1,
      };
    }

    return null;
  }
}
