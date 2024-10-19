// src/utils/CssUtils.ts

export class CssUtils {
    /**
     * Escapes special characters in a CSS identifier.
     * @param identifier The CSS identifier to escape.
     */
    public static escape(identifier: string): string {
      if (typeof CSS.escape === 'function') {
        return CSS.escape(identifier);
      } else {
        // Polyfill for CSS.escape()
        return identifier.replace(/([^\w-])/g, '\\$1');
      }
    }
  
    /**
     * Builds a CSS selector string from an array of SelectorParts.
     * @param parts The parts of the selector.
     */
    public static buildSelector(parts: { name: string; level?: number }[]): string {
      if (parts.length === 0) {
        return '*';
      }
  
      let selector = parts[0].name;
      for (let i = 1; i < parts.length; i++) {
        const current = parts[i];
        const previous = parts[i - 1];
  
        if (current.level !== undefined && previous.level !== undefined) {
          if (current.level === previous.level - 1) {
            selector = `${current.name} > ${selector}`;
          } else {
            selector = `${current.name} ${selector}`;
          }
        } else {
          selector = `${current.name} ${selector}`;
        }
      }
      return selector;
    }
  }