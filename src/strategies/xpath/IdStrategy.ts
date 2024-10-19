// src/strategies/xpath/IdStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';

/**
 * Strategy for generating XPath selectors based on the element's ID attribute.
 */
export class IdStrategy implements Strategy {
  /**
   * Creates an instance of IdStrategy.
   * @param options - Configuration options for the strategy.
   * @param options.idName - A function to validate the ID name.
   */
  constructor(private options: { idName: (id: string) => boolean }) {}

  /**
   * Generates an XPath selector part for the given element based on its ID.
   * 
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object if the element has a valid ID, otherwise null.
   */
  public generate(element: Element): SelectorPart | null {
    const id = element.getAttribute('id');

    if (id && this.options.idName(id)) {
      const escapedId = id.replace(/"/g, '\\"');
      return {
        name: `*[@id="${escapedId}"]`,
        penalty: 0,
      };
    }

    return null;
  }
}
