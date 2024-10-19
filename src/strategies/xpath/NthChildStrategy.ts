// src/strategies/xpath/NthChildStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';
import { DomUtils } from '../../utils/DomUtils';

/**
 * Strategy for generating an XPath selector based on the nth-child position of an element.
 */
export class NthChildStrategy implements Strategy {
  /**
   * Generates an XPath selector part for the given element based on its sibling index.
   * 
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object containing the XPath expression and its penalty, or null if the index cannot be determined.
   */
  public generate(element: Element): SelectorPart | null {
    const index = DomUtils.getElementSiblingIndex(element);

    if (index !== null) {
      return {
        name: `*[${index}]`,
        penalty: 1,
      };
    }

    return null;
  }
}
