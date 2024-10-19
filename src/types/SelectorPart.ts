// src/types/SelectorPart.ts

/**
 * Represents a part of the CSS selector.
 */
export interface SelectorPart {
    /**
     * The string representing this part of the CSS selector.
     * For example: '#my-id', '.my-class', 'div', etc.
     */
    name: string;
  
    /**
     * A number representing the penalty or cost associated with this selector part.
     * Lower penalties indicate preferred selectors.
     */
    penalty: number;
  
    /**
     * (Optional) The hierarchical level of this part in the selector path.
     * Can be used to order or structure the final selector.
     */
    level?: number;
}