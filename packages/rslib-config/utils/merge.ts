import isArray from "lodash/isArray";

export const mergeUtils = <T = unknown>(objValue: T, srcValue: T) => {
	if (isArray(objValue)) {
		return objValue.concat(srcValue);
	}
};
