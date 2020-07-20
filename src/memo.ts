import { useRef } from "react";
import { EqualityFn, depsShallowEqual } from "./equality";

type DependencyList = readonly any[];

export const createMemoHook = (areDepsEqual: EqualityFn = depsShallowEqual) => {
	const initialResultInfo = {
		called: false,
	} as const;

	return <T>(
		fn: (prevValue: T | null, isFirstCall: boolean) => T,
		deps: DependencyList
	) => {
		const resultRef = useRef<{ called: false } | { called: true; data: T }>(
			initialResultInfo
		);
		const depsRef = useRef(deps);

		if (!resultRef.current.called) {
			resultRef.current = {
				called: true,
				data: fn(null, true),
			};
			return resultRef.current.data;
		}

		const prevDeps = depsRef.current;
		const haveDepsChanged = !areDepsEqual(prevDeps, deps);
		if (haveDepsChanged) {
			// deps have changed; recalculating output;
			resultRef.current = {
				called: true,
				data: fn(
					(resultRef.current.called
						? resultRef.current.data
						: null) as T,
					!resultRef.current.called as false
				),
			};
			depsRef.current = deps;
		}

		return resultRef.current!.data;
	};
};
