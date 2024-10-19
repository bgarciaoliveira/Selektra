// src/strategies/xpath/AttributeStrategy.ts

import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';

/**
 * Strategy for generating XPath selectors based on element attributes.
 */
export class AttributeStrategy implements Strategy {
  /**
   * Creates an instance of AttributeStrategy.
   * @param options - Configuration options for the strategy.
   * @param options.attr - A function to determine if an attribute should be included in the selector.
   */
  constructor(private options: { attr: (name: string, value: string) => boolean }) {}

  /**
   * Generates a selector part for the given element based on its attributes.
   * @param element - The DOM element for which to generate the selector.
   * @returns A SelectorPart object if a suitable attribute is found, otherwise null.
   */
  public generate(element: Element): SelectorPart | null {
    const attributes = Array.from(element.attributes).filter(attr => this.options.attr(attr.name, attr.value));

    if (attributes.length > 0) {
      const attr = attributes[0];
      const escapedName = attr.name.replace(/"/g, '\\"');
      const escapedValue = attr.value.replace(/"/g, '\\"');
      return {
        name: `*[@${escapedName}="${escapedValue}"]`,
        penalty: 0.5,
      };
    }

    return null;
  }
}
