import {pluginReact} from "@rsbuild/plugin-react";
import mergeWith from "lodash/mergeWith";
import {mergeUtils} from "./utils/merge.ts";
import {LibConfig, RslibConfig} from "@rslib/core";

const shared: LibConfig = {
	dts: {
		bundle: false
	}
};

const defaultConfig: RslibConfig = {
	lib: [
		{
			...shared,
			format: "esm",
			output: {
				distPath: {
					root: "./dist/esm"
				}
			}
		},
		{
			...shared,
			format: "cjs",
			output: {
				distPath: {
					root: "./dist/cjs"
				}
			}
		}
	],
	plugins: [pluginReact()]
};

export const RsLibConfigCore = (config?: RslibConfig): RslibConfig => {
	return mergeWith(defaultConfig, config ?? {}, mergeUtils);
};
