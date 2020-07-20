/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from "react";
import { EqualityFn, depsShallowEqual } from "./equality";

export const createDependenciesInfoHook = (
	areDepsEqual: EqualityFn = depsShallowEqual
) => <T extends readonly any[]>(...args: T) => {
	const stableVersionRef = useRef(0);
	const versionRef = useRef(1);
	const lastArgsRef = useRef(args);

	const getVersion = () => {
		return versionRef.current;
	};
	const getStableVersion = () => {
		return stableVersionRef.current;
	};
	const unsafelyIncrementVersion = () => {
		versionRef.current++;
	};
	const isLastVersion = (version: number) => {
		return version === versionRef.current;
	};
	const isStableVersion = (version?: number) => {
		if (typeof version === "undefined") {
			return stableVersionRef.current === versionRef.current;
		}
		return version === stableVersionRef.current;
	};
	const setAsStable = (version?: number) => {
		if (typeof version === "undefined") {
			stableVersionRef.current = versionRef.current;
		} else {
			stableVersionRef.current = version;
		}
	};
	const equalsLastDependencies = (...currentArgs: any[]): boolean => {
		return areDepsEqual(lastArgsRef.current, currentArgs);
	};
	if (!equalsLastDependencies(...args)) {
		versionRef.current++;
		lastArgsRef.current = args;
	}
	const getLastDependencies = () => {
		return lastArgsRef.current;
	};

	return useRef({
		getVersion,
		getStableVersion,
		getLastDependencies,
		isLastVersion,
		isStableVersion,
		setAsStable,
		equalsLastDependencies,
		unsafelyIncrementVersion,
	}).current;
};
