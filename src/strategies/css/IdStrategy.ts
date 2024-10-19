// src/strategies/css/IdStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';
import { CssUtils } from '../../utils/CssUtils';

/**
 * Strategy for generating CSS selectors based on the ID of an element.
 */
export class IdStrategy implements Strategy {
  /**
   * Creates an instance of IdStrategy.
   * @param options - Configuration options for the strategy.
   * @param options.idName - A function to validate the ID name.
   */
  constructor(private options: { idName: (id: string) => boolean }) {}

  /**
   * Generates a CSS selector part for the given element based on its ID.
   * 
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object containing the selector name and penalty, or null if no valid ID is found.
   */
  public generate(element: Element): SelectorPart | null {
    const id = element.getAttribute('id');

    if (id && this.options.idName(id)) {
      const escapedId = CssUtils.escape(id);
      return {
        name: `#${escapedId}`,
        penalty: 0,
      };
    }

    return null;
  }
}