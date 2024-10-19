// src/types/Options.ts

export interface Options {
    /**
     * The root element from which the selector will be generated.
     * Can be a Document or Element.
     */
    root: Document | Element;
  
    /**
     * Function to filter IDs that can be used in the selector.
     * Receives the ID as a string and returns a boolean.
     */
    idName: (id: string) => boolean;
  
    /**
     * Function to filter class names that can be used in the selector.
     * Receives the class name and returns a boolean.
     */
    className: (className: string) => boolean;
  
    /**
     * Function to filter tag names that can be used in the selector.
     * Receives the tag name and returns a boolean.
     */
    tagName: (tagName: string) => boolean;
  
    /**
     * Function to filter attributes that can be used in the selector.
     * Receives the attribute name and value, returns a boolean.
     */
    attr: (name: string, value: string) => boolean;
  
    /**
     * Minimum length of the initial path when generating the selector.
     */
    seedMinLength: number;
  
    /**
     * Minimum length of the path after optimization.
     */
    optimizedMinLength: number;
  
    /**
     * Maximum number of candidates to consider when generating the selector.
     */
    maxCandidates: number;
  
    /**
     * Maximum number of combinations to test.
     */
    maxCombinations: number;
  
    /**
     * Maximum time in milliseconds to generate the selector before throwing an error.
     * Optional.
     */
    timeoutMs?: number;

    /**
     * Maximum depth for DOM traversal.
     * Optional.
     */
    maxDepth?: number;

    /**
    * Enable debug logging.
    */
    debug?: boolean;
}