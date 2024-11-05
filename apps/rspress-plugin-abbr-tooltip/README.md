# `rspress-plugin-abbr-tooltip` ![NPM Version](https://img.shields.io/npm/v/rspress-plugin-abbr-tooltip)

And it will be rendered as:

<div align="center">
  <img src="https://i.imgur.com/uKUGP2D.png" alt="abbr-plugin-tooltip" width="400"/>
</div>

## Usage

```bash
npm i rspress-plugin-abbr-tooltip
pnpm add rspress-plugin-abbr-tooltip
```

```ts
import * as path from "path";
import { defineConfig } from "rspress/config";
import { pluginAbbreviate } from "rspress-plugin-abbr-tooltip";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  plugins: [
    pluginAbbreviate({
      DOM: "Document Object Model",
    }),
  ],
});
```

### Configure

Patterns

The matchers parameter uses the [micromatch](https://www.npmjs.com/package/micromatch) library with POSIX bracket expressions. Each pattern matcher includes:

• `pattern`: A regular expression pattern using POSIX-style brackets to match different abbreviation formats.<br />
• `parser`: A function to process each match, allowing custom transformations to retrieve the core abbreviation.

```ts
import * as path from "path";
import { defineConfig } from "rspress/config";
import { pluginAbbreviate } from "rspress-plugin-abbr-tooltip";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  plugins: [
    pluginAbbreviate(
      {
        DOM: "Document Object Model",
      },
      [
        {
          // UUID. => UUID (.|,|@...)
          pattern: "[[:alpha:]]+[[:punct:]]",
          parser: (text) => text.slice(0, -1),
        },
      ]
    ),
  ],
});
```
