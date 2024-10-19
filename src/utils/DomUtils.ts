// src/utils/DomUtils.ts

export class DomUtils {
    /**
     * Finds the root document from a given root node.
     * @param rootNode The root node (Document or Element).
     */
    public static findRootDocument(rootNode: Document | Element): Document | Element {
      if (rootNode.nodeType === Node.DOCUMENT_NODE) {
        return rootNode;
      } else {
        return rootNode.ownerDocument || document;
      }
    }
  
    /**
     * Checks if an element matches a given CSS selector.
     * @param element The element to test.
     * @param selector The CSS selector string.
     * @param context The context in which to perform the query (Document or Element).
     */
    public static matches(element: Element, selector: string, context: Document | Element): boolean {
      const elements = context.querySelectorAll(selector);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i] === element) {
          return true;
        }
      }
      return false;
    }
  
    /**
     * Gets the index of an element among its siblings.
     * Returns a 1-based index as used in CSS :nth-child pseudo-class.
     * @param element The element to get the index for.
     */
    public static getElementIndex(element: Element): number | null {
      if (!element.parentNode) {
        return null;
      }
  
      let index = 1; // CSS nth-child is 1-based
      let sibling = element.previousSibling;
  
      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
  
      return index;
    }

    /**
     * Gets the position of the element among its siblings of the same type.
     * Returns a 1-based index.
     * @param element The element to get the index for.
     */
    public static getElementSiblingIndex(element: Element): number | null {
        if (!element.parentNode) {
            return null;
        }

        const siblings = Array.from(element.parentNode.children).filter(
            sib => sib.nodeName === element.nodeName
        );

        return siblings.indexOf(element) + 1; // 1-based index
    }

    /**
     * Gets the level (depth) of an element in the DOM tree relative to the root.
     * @param element The element to get the level for.
     * @param root The root element.
     */
    public static getElementLevel(element: Element, root: Element | Document): number {
      let level = 0;
      let current: Element | null = element;

      while (current && current !== root && current.parentElement) {
        level++;
        current = current.parentElement;
      }

      return level;
    }
}