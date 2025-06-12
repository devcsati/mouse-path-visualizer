import type { EasingFunctionName } from "./algorithms";

export type Point = {
	x: number;
	y: number;
	t: number;
};

export type Segment = Point[];

export type AnimationParams = {
	id: string;
	easeInRatio: number;
	easeOutRatio: number;
	easeInFn: EasingFunctionName;
	easeOutFn: EasingFunctionName;
};
