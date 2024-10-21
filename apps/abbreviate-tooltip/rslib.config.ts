import {defineConfig} from "@rslib/core";
import {RsLibConfigCore} from "@icondo/rslib/rslib.config";

export default defineConfig(
	RsLibConfigCore({
		lib: [],
		plugins: [
			// pluginNodePolyfill({)
		],
		output: {
			externals: {
				"node:path": "path"
			}
		}
	})
);
