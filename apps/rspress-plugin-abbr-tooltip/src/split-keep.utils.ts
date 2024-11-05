export function splitKeep(input: string, delimiter: string) {
	const result: string[] = [];
	let current = "";

	for (let i = 0; i < input.length; i++) {
		const char = input[i];

		if (input.substr(i, delimiter.length) === delimiter) {
			if (current) {
				result.push(current);
				current = "";
			}
			result.push(delimiter);
			i += delimiter.length - 1;
		} else {
			current += char;
		}
	}

	if (current) {
		result.push(current);
	}

	return result;
}
