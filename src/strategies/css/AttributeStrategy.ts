// src/strategies/css/AttributeStrategy.ts


import { Strategy } from '../Strategy';
import { SelectorPart } from '../../types';
import { CssUtils } from '../../utils/CssUtils';

export class AttributeStrategy implements Strategy {
  constructor(private options: { attr: (name: string, value: string) => boolean }) {}

  public generate(element: Element): SelectorPart | null {
    const attributes = Array.from(element.attributes).filter(attr => this.options.attr(attr.name, attr.value));

    if (attributes.length > 0) {
      const attr = attributes[0];
      const escapedName = CssUtils.escape(attr.name);
      const escapedValue = CssUtils.escape(attr.value);
      return {
        name: `[${escapedName}="${escapedValue}"]`,
        penalty: 0.5,
      };
    }

    return null;
  }
}
