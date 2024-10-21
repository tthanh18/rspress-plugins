import {Paragraph, PhrasingContent, Root, Text} from "mdast";
import {Plugin} from "unified";
import {IPhrasingContent} from ".";

function createElement(title: string, text: string): PhrasingContent {
	return {
		type: "mdxJsxTextElement",
		name: "div",
		attributes: [
			{
				type: "mdxJsxAttribute",
				name: "class",
				value: "tooltip"
			}
		],
		children: [
			{
				type: "text",
				value: title
			},
			{
				type: "mdxJsxTextElement",
				name: "span",
				attributes: [
					{
						type: "mdxJsxAttribute",
						name: "class",
						value: "tooltiptext"
					}
				],
				children: [
					{
						type: "text",
						value: text
					}
				]
			}
		]
	};
}

function processTextNode(
	paragraphNode: Paragraph,
	textNode: Text,
	data: IPhrasingContent
) {
	const text = textNode.value;

	Object.entries(data).forEach(([key, value]) => {
		if (text.includes(key)) {
			const textParts = text.split(key);

			const newNodes: PhrasingContent[] = [];

			if (textParts[0]) {
				newNodes.push({
					type: "text",
					value: textParts[0]
				});
			}

			const tooltipNode = createElement(key, value as string);
			newNodes.push(tooltipNode);

			if (textParts[1]) {
				newNodes.push({
					type: "text",
					value: textParts[1]
				});
			}

			const index = paragraphNode.children.indexOf(textNode);
			paragraphNode.children.splice(index, 1, ...newNodes);
		}
	});
}

function processParagraphNode(
	paragraphNode: Paragraph,
	data: IPhrasingContent
) {
	paragraphNode.children.forEach((child) => {
		if (child.type === "text") {
			processTextNode(paragraphNode, child, data);
		}
	});
}

function processListNode(listNode: any, data: any) {
	listNode.children.forEach((listItemNode: any) => {
		listItemNode.children.forEach((item: any) => {
			if (item.type === "paragraph") {
				processParagraphNode(item, data);
			}
		});
	});
}

function transformer(tree: Root, data: IPhrasingContent) {
	let i = 0;

	try {
		while (i < tree.children.length) {
			const node = tree.children[i];

			switch (node.type) {
				case "paragraph":
					processParagraphNode(node, data);
					break;
				case "list":
					processListNode(node, data);
					break;
			}

			i++;
		}
	} catch (e) {
		console.log(e);
		throw e;
	}
}
export const remarkPluginAbb: Plugin<[IPhrasingContent], Root> = (
	data: IPhrasingContent
) => {
	return (tree: Root) => transformer(tree, data);
};
