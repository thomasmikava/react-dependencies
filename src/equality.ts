type DependencyList = readonly any[];

export type EqualityFn = (
	previous: DependencyList,
	current: DependencyList
) => boolean;

export const createDependenciesEqualityFn = (
	equalityFn: (obj1: any, obj2: any) => boolean
) => (previous: DependencyList, current: DependencyList): boolean => {
	if (previous.length !== current.length) return false;
	for (let i = 0; i < previous.length; i++) {
		const prev = previous[i];
		const next = current[i];
		if (prev === next) continue;
		if (!equalityFn(prev, next)) return false;
	}
	return true;
};

export const depsShallowEqual = createDependenciesEqualityFn(
	(x: any, y: any) => x === y
);

export const deepEqual = <T1 extends any, T2 extends any>(
	value1: T1,
	value2: T2,
	depth = Infinity
): boolean => {
	if ((value1 as any) === (value2 as any)) return true;
	if (typeof value1 !== typeof value2) return false;
	if (typeof value1 !== "object" || typeof value2 !== "object") return false;

	const obj1Keys = Object.keys(value1 as any).sort();
	const obj2Keys = Object.keys(value2 as any).sort();
	if (obj1Keys.length !== obj2Keys.length) return false;
	for (let i = 0; i < obj1Keys.length; i++) {
		const key1 = obj1Keys[i];
		const key2 = obj2Keys[i];
		if (key1 !== key2) return false;
		if (value1[key1] !== value2[key2]) {
			if (depth <= 1) return false;
			if (!deepEqual(value1[key1], value2[key2], depth - 1)) {
				return false;
			}
		}
	}
	return true;
};

export const depsDeepEquality = createDependenciesEqualityFn(deepEqual);
