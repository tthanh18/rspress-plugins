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
import {IPatternMatcher, IPhrasingContent} from ".";
import micromatch from "micromatch";
import {splitKeep} from "./split-keep.utils";

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
	data: IPhrasingContent,
	matchers?: IPatternMatcher[]
) {
	const text = textNode.value;
	const textParts = text.split(" ");
	const newNodes: PhrasingContent[] = [];

	const processPushElement = (word: string) =>
		newNodes.push(createElement(word, data[word]));
	const processPushNodeChar = (part: string) =>
		newNodes.push({type: "text", value: part});

	textParts.forEach((word, index) => {
		const specialChars =
			matchers?.reduce(
				(acc, {parser, pattern}) => {
					if (micromatch.isMatch(word, pattern)) {
						acc[word] = parser(word);
					}
					return acc;
				},
				{} as Record<string, string>
			) ?? {};

		// If the full word exists in data, create a tooltip for it
		if (data[word] != null) {
			processPushElement(word);
		}
		// If the last character is a special character, check if the word without it exists in data
		else if (specialChars[word]) {
			const findWord = specialChars[word];

			const slitParts = splitKeep(word, findWord);

			slitParts.forEach((part) => {
				if (data[part]) {
					processPushElement(part);
				} else {
					processPushNodeChar(part);
				}
			});
		}
		// If no special handling needed, add word as plain text
		else {
			processPushNodeChar(word);
		}
		if (index < textParts.length - 1) {
			processPushNodeChar(" ");
		}
	});

	const originalIndex = paragraphNode.children.indexOf(textNode);
	if (originalIndex !== -1) {
		paragraphNode.children.splice(originalIndex, 1, ...newNodes);
	}
}

function processParagraphNode(
	paragraphNode: Paragraph,
	data: IPhrasingContent,
	matchers?: IPatternMatcher[]
) {
	paragraphNode.children.forEach((child) => {
		if (child.type === "text") {
			processTextNode(paragraphNode, child, data, matchers);
		}
	});
}

function processListNode(
	listNode: List,
	data: IPhrasingContent,
	matchers?: IPatternMatcher[]
) {
	listNode.children.forEach((listItemNode: any) => {
		listItemNode.children.forEach((item: any) => {
			if (item.type === "paragraph") {
				processParagraphNode(item, data, matchers);
			}
		});
	});
}

function processTableNode(
	tableNode: Table,
	data: IPhrasingContent,
	matchers?: IPatternMatcher[]
) {
	tableNode.children.forEach((tableRow: TableRow) => {
		tableRow.children.forEach((cell: TableCell) => {
			cell.children.forEach((cellContent: any, index) => {
				if (cellContent.type === "text") {
					processTextNode(cell, cellContent, data, matchers);
				}
			});
		});
	});
}

function transformer(
	tree: Root,
	data: IPhrasingContent,
	matchers?: IPatternMatcher[]
) {
	let i = 0;

	try {
		while (i < tree.children.length) {
			const node = tree.children[i];

			switch (node.type) {
				case "paragraph":
					processParagraphNode(node, data, matchers);
					break;

				case "list":
					processListNode(node, data, matchers);
					break;

				case "table":
					processTableNode(node, data, matchers);
					break;
			}

			i++;
		}
	} catch (e) {
		console.log(e);
		throw e;
	}
}
export const remarkPluginAbb: Plugin<
	[IPhrasingContent, IPatternMatcher[]],
	Root
> = (data: IPhrasingContent, matchers: IPatternMatcher[]) => {
	return (tree: Root) => transformer(tree, data, matchers);
};
