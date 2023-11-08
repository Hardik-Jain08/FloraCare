export function debounce<T extends Function>(
	fn: T,
	options: {
		scope?: Function;
		duration?: number;
		fireImmediately?: boolean | Function;
		resetAfter?: number;
	} = {}
): T {
	const {
		duration = 500,
		// @ts-ignore
		scope = this,
		fireImmediately,
		resetAfter,
	} = options;
	let timer: unknown;
	let hasFiredImmediately = false;
	let hasFiredResetTimer: unknown;
	const doAfterFireImmediately = () => {
		hasFiredImmediately = true;
		if (resetAfter) {
			hasFiredResetTimer && clearTimeout(hasFiredResetTimer as number);
			hasFiredResetTimer = setTimeout(
				() => (hasFiredImmediately = false),
				resetAfter
			);
		}
	};
	// @ts-ignore
	return (...args) => {
		const fire = () => fn.apply(scope, args);
		if (fireImmediately && !hasFiredImmediately) {
			if (typeof options.fireImmediately === "function") {
				options.fireImmediately();
			} else fire();
			doAfterFireImmediately();
		}
		timer && clearTimeout(timer as number);
		timer = setTimeout(fire, duration);
	};
}

type TimeoutHandle = ReturnType<typeof setTimeout>;

export const simpleDebounce = (fn: Function, timeout?: number) => {
	let timer: TimeoutHandle | null = null;
	return function (...args: unknown[]) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(fn, timeout, ...args) as unknown as TimeoutHandle;
	};
};
