import type {
	List,
	Paragraph,
	PhrasingContent,
	Root,
	Table,
	TableCell,
	TableRow,
	Text
} from "mdast";
import type {Plugin} from "unified";
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
	paragraphNode: Paragraph | TableCell,
	textNode: Text,
	data: IPhrasingContent
) {
	const text = textNode.value;
	const textParts = text.split(" ");
	const newNodes: PhrasingContent[] = [];

	textParts.forEach((word, index) => {
		if (data[word]) {
			const tooltipNode = createElement(word, data[word]);
			newNodes.push(tooltipNode);
		} else {
			newNodes.push({
				type: "text",
				value: word
			});
		}
		if (index < textParts.length - 1) {
			newNodes.push({
				type: "text",
				value: " "
			});
		}
	});

	const originalIndex = paragraphNode.children.indexOf(textNode);
	if (originalIndex !== -1) {
		paragraphNode.children.splice(originalIndex, 1, ...newNodes);
	}
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

function processListNode(listNode: List, data: IPhrasingContent) {
	listNode.children.forEach((listItemNode: any) => {
		listItemNode.children.forEach((item: any) => {
			if (item.type === "paragraph") {
				processParagraphNode(item, data);
			}
		});
	});
}

function processTableNode(tableNode: Table, data: IPhrasingContent) {
	tableNode.children.forEach((tableRow: TableRow) => {
		tableRow.children.forEach((cell: TableCell) => {
			cell.children.forEach((cellContent: any, index) => {
				if (cellContent.type === "text") {
					processTextNode(cell, cellContent, data);
				}
			});
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

				case "table":
					processTableNode(node, data);
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
