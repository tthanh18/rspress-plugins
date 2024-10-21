import {RspressPlugin} from "@rspress/shared";
import {PresetConfigMutator} from "rspress-plugin-devkit";
import {remarkPluginAbb} from "./remark-plugins";
import path from "node:path";
import "../abbreviate.css";

export type IPhrasingContent = Record<string, string>;

export function pluginAbbreviate(data: IPhrasingContent): RspressPlugin {
	return {
		name: "plugin-abbreviate",
		config(config) {
			return new PresetConfigMutator(config).disableMdxRs().toConfig();
		},
		globalStyles: path.join(__dirname, "./static/css/index.css"),
		markdown: {
			remarkPlugins: [[remarkPluginAbb as any, data]]
		}
	};
}
