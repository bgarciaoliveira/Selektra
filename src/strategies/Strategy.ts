// src/strategies/Strategy.ts

import { SelectorPart } from '../types';

export interface Strategy {
  /**
   * Attempts to generate a selector part for the given element.
   * Returns a SelectorPart if successful, or null if the strategy cannot generate a part.
   * @param element The element to generate a selector part for.
   */
  generate(element: Element): SelectorPart | null;
}