// src/strategies/css/TagStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';

/**
 * A strategy for generating CSS selectors based on the tag name of an element.
 */
export class TagStrategy implements Strategy {
  /**
   * Creates an instance of TagStrategy.
   * @param options - An object containing a function to determine if a tag name should be used.
   */
  constructor(private options: { tagName: (tagName: string) => boolean }) {}

  /**
   * Generates a selector part for the given element based on its tag name.
   * @param element - The DOM element for which to generate the selector part.
   * @returns A SelectorPart object if the tag name is valid, otherwise null.
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
