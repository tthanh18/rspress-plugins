# `rspress-plugin-abbr-tooltip` ![NPM Version](https://img.shields.io/npm/v/rspress-plugin-abbr-tooltip)

And it will be rendered as:

<div align="center">
  <img src="https://uc6de9a1b90477bf31815635c59b.previews.dropboxusercontent.com/p/thumb/ACZctQW4184iPaBRyZdCTeKeBT5V33HlUT5X6bw-vScTnH-gsnHRIs357_Yv1OohEJQwamOT0W49uEMXofGz5z0fjaYgStVkh60USyABgTU-0JInQLRcLDZo8Ds93v8Oq1VrviUZclOCHivEgqJXSwHH6qRYg42_tUzyAbObVvyv_LZ7WA7wXD6Dma1pJeyelDJ-zHsdiUmwGRfBla73uMOpiuCx_t-6zR36WF0pDnmxlR_XumtifbMpPIpKEK52GMbss4eoHsxXJf1clGxG21vFstZu3B_7wHAkbDTANJOBsI1uhkM-AQ7Qssm-D0ZvETnd5wytpCshuA8kfdVnjHvNCiqGnz4i9fXv6yvrg5Zp9ZgZwVW0IO70p0HdEFv38II/p.png?is_prewarmed=true" alt="sample" width="400"/>
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
