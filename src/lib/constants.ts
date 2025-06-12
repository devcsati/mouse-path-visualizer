import type { AnimationParams } from "./types";

export const TIME_THRESHOLD = 100; // ms
export const ANIMATION_DURATION_PER_SEGMENT = 2000; // ms

export const DEFAULT_ANIMATION_PARAMS: Omit<AnimationParams, "id"> = {
	easeInRatio: 0.2,
	easeOutRatio: 0.2,
	easeInFn: "easeInQuad",
	easeOutFn: "easeOutQuad",
};
