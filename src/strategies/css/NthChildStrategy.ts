// src/strategies/css/NthChildStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';
import { DomUtils } from '../../utils/DomUtils';

/**
 * Strategy for generating a CSS selector using the :nth-child pseudo-class.
 */
export class NthChildStrategy implements Strategy {
  /**
   * Generates a CSS selector part for the given element using the :nth-child pseudo-class.
   * 
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object containing the :nth-child selector and its penalty, or null if the index cannot be determined.
   */
  public generate(element: Element): SelectorPart | null {
    const index = DomUtils.getElementIndex(element);

    if (index !== null) {
      return {
        name: `:nth-child(${index})`,
        penalty: 1,
      };
    }

    return null;
  }
}
