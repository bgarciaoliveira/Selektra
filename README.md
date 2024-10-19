# Selektra

Easily generate unique and optimized CSS or XPath selectors for any DOM element.

## Overview

This library provides tools to generate unique CSS and XPath selectors for DOM elements. It's perfect for automated testing, web scraping, or any situation where you need a reliable way to reference specific elements in the DOM.

## Features

- **Unique Selectors**: Generates selectors that uniquely identify elements.
- **CSS and XPath Support**: Choose between CSS and XPath selector generation.
- **Customizable Strategies**: Tailor the generation process with various strategies.
- **Optimized Selectors**: Produces the shortest possible selector without sacrificing uniqueness.
- **Debug Logging**: Optional debug logs to trace the generation process.
- **Module Compatibility**: Works seamlessly with both CommonJS (`require`) and ES6 modules (`import`).

## Installation

Install via npm:

```bash
npm install selektra
```

## Usage

### Module Import

The library is compatible with both CommonJS and ES6 module systems.

#### Using ES6 `import`

```javascript
import { CSSSelectorGenerator, XPathSelectorGenerator } from 'selektra';
```

#### Using CommonJS `require`

```javascript
const { CSSSelectorGenerator, XPathSelectorGenerator } = require('selektra');
```

### CSS Selector Generation

```javascript
import { CSSSelectorGenerator } from 'selektra';

// Initialize the generator with optional configurations
const generator = new CSSSelectorGenerator({
  debug: true, // Enable debug logs
  idName: (id) => !id.startsWith('skip-'), // Custom ID filtering
});

// Select your target element
const element = document.querySelector('.my-element');

// Generate a unique CSS selector
const selector = generator.generate(element);

console.log('Generated CSS selector:', selector);
```

### XPath Selector Generation

```javascript
import { XPathSelectorGenerator } from 'selektra';

// Initialize the generator with optional configurations
const generator = new XPathSelectorGenerator({
  debug: true, // Enable debug logs
  tagName: (tag) => tag !== 'div', // Custom tag filtering
});

// Select your target element
const element = document.querySelector('.my-element');

// Generate a unique XPath selector
const xpath = generator.generate(element);

console.log('Generated XPath selector:', xpath);
```

### Using with Puppeteer

You can also use this library with Puppeteer to generate selectors for elements on a webpage. Here's an example:

```javascript
const puppeteer = require('puppeteer');
const { CSSSelectorGenerator } = require('selektra');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Use Puppeteer's page.evaluate to interact with the DOM
  const selector = await page.evaluate(() => {
    const generator = new CSSSelectorGenerator({
      debug: true, // Enable debug logs
    });

    // Select your target element
    const element = document.querySelector('h1');

    // Generate a unique CSS selector
    return generator.generate(element);
  });

  console.log('Generated CSS selector:', selector);

  await browser.close();
})();
```

## Configuration Options

Both `CSSSelectorGenerator` and `XPathSelectorGenerator` accept an options object to customize their behavior:

```javascript
const options = {
  root: document.body,
  idName: (id) => true,
  className: (className) => true,
  tagName: (tagName) => true,
  attr: (name, value) => false,
  seedMinLength: 1,
  optimizedMinLength: 2,
  maxCandidates: 1000,
  maxCombinations: 10000,
  timeoutMs: undefined,
  maxDepth: undefined,
  debug: false,
};
```

### Option Details

- **`root`**: The root element or document for generating selectors (default is `document.body`).
- **`idName`**: Function to determine if an element's ID should be used.
- **`className`**: Function to determine if an element's class should be used.
- **`tagName`**: Function to determine if an element's tag name should be used.
- **`attr`**: Function to determine if an attribute should be used.
- **`seedMinLength`**: Minimum length of the initial selector path (default is `1`).
- **`optimizedMinLength`**: Minimum length after optimization (default is `2`).
- **`maxCandidates`**: Maximum candidates to consider (default is `1000`).
- **`maxCombinations`**: Maximum combinations to test during optimization (default is `10000`).
- **`timeoutMs`**: Timeout in milliseconds to prevent long executions.
- **`maxDepth`**: Maximum depth for DOM traversal.
- **`debug`**: Enable debug logging (default is `false`).

## Examples

### Custom ID and Class Filtering

```javascript
const generator = new CSSSelectorGenerator({
  idName: (id) => !id.startsWith('temp-'),
  className: (className) => !['ignore', 'skip'].includes(className),
});
```

### Using Attributes in Selectors

```javascript
const generator = new XPathSelectorGenerator({
  attr: (name, value) => name === 'data-test-id',
});
```

### Limiting Traversal Depth

```javascript
const generator = new CSSSelectorGenerator({
  maxDepth: 3, // Limit traversal to 3 levels up the DOM
});
```

### Setting a Timeout

```javascript
const generator = new XPathSelectorGenerator({
  timeoutMs: 2000, // Timeout after 2 seconds
});
```

## Debugging

Enable debug mode to see detailed logs of the selector generation process:

```javascript
const generator = new CSSSelectorGenerator({
  debug: true,
});
```

This will output logs like:

```
[CSSSelectorGenerator] Starting selector generation for element: span
[CSSSelectorGenerator] Applying strategies at depth 0 for element: span
[CSSSelectorGenerator] Strategy found part: .active
[CSSSelectorGenerator] Unique path found: .active
[CSSSelectorGenerator] Initial path: [".active"]
[CSSSelectorGenerator] Path length is less than or equal to optimizedMinLength; skipping optimization.
[CSSSelectorGenerator] Generated selector: .active
```

## How It Works

The generator traverses the DOM from the target element up to the root, applying various strategies to build a unique selector:

1. **Strategies Applied**:
   - **ID Strategy**: Uses element IDs.
   - **Class Strategy**: Uses element classes.
   - **Attribute Strategy**: Uses element attributes.
   - **Tag Strategy**: Uses tag names.
   - **Nth-Child Strategy**: Uses the element's position among siblings.

2. **Path Building**:
   - Builds an initial path by collecting selector parts from each strategy.

3. **Optimization**:
   - Attempts to shorten the selector while maintaining uniqueness.

4. **Uniqueness Check**:
   - Ensures the selector uniquely identifies the target element.

## Module Compatibility

The library is designed to work seamlessly with different module systems:

- **ES6 Modules**: Use `import` statements as shown in the examples.
- **CommonJS**: Use `require` statements if your environment does not support ES6 modules.

### Example with `require`

```javascript
const { CSSSelectorGenerator } = require('selektra');

const generator = new CSSSelectorGenerator();

const element = document.querySelector('.my-element');

const selector = generator.generate(element);

console.log('Generated CSS selector:', selector);
```

## Contributing

Contributions are welcome! Here's how you can help:

- **Report Bugs**: If you find a bug, please open an issue.
- **Feature Requests**: Have an idea? Let's discuss it.
- **Pull Requests**: Feel free to submit PRs with improvements.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or need assistance, feel free to open an issue on the GitHub repository.

---

Happy coding!
