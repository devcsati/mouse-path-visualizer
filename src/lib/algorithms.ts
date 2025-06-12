import type { Point, Segment } from "./types";

/**
 * Segments points into continuous strokes based on a time threshold.
 * @param points The array of points to segment.
 * @param timeThreshold The maximum time gap (in ms) to be considered part of the same segment.
 * @returns An array of segments, where each segment is an array of points.
 */
export const segmentPoints = (
	points: Point[],
	timeThreshold: number,
): Segment[] => {
	console.log("segmentPoints", points, timeThreshold);
	if (points.length === 0) {
		return [];
	}

	const segments: Segment[] = [];
	let currentSegment: Segment = [points[0]];

	for (let i = 1; i < points.length; i++) {
		const timeDiff = points[i].t - points[i - 1].t;

		if (timeDiff < timeThreshold) {
			currentSegment.push(points[i]);
		} else {
			if (currentSegment.length > 1) {
				segments.push(currentSegment);
			}
			currentSegment = [points[i]];
		}
	}

	if (currentSegment.length > 1) {
		segments.push(currentSegment);
	}

	return segments;
};

/**
 * Generates an SVG path string for a Catmull-Rom spline that passes through the given points.
 * @param points The array of points for the spline.
 * @returns An SVG path data string.
 */
export const generateCatmullRomPath = (points: Point[]): string => {
	if (points.length < 2) {
		return "";
	}

	let path = `M ${points[0].x} ${points[0].y}`;

	for (let i = 0; i < points.length - 1; i++) {
		const p0 = i === 0 ? points[i] : points[i - 1];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = i === points.length - 2 ? points[i + 1] : points[i + 2];

		const cp1x = p1.x + (p2.x - p0.x) / 6;
		const cp1y = p1.y + (p2.y - p0.y) / 6;

		const cp2x = p2.x - (p3.x - p1.x) / 6;
		const cp2y = p2.y - (p3.y - p1.y) / 6;

		path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
	}

	return path;
};

/**
 * An easing function that provides a gentle acceleration and deceleration.
 * @param t The time progress, from 0 to 1.
 * @returns The eased value, from 0 to 1.
 */
export const easeInOutCubic = (t: number): number => {
	return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

export type EasingFunction = (t: number) => number;

export const EasingFunctionNames = [
	"linear",
	"easeInQuad",
	"easeOutQuad",
	"easeInOutQuad",
	"easeInCubic",
	"easeOutCubic",
	"easeInOutCubic",
	"easeInSine",
	"easeOutSine",
] as const;

export type EasingFunctionName = (typeof EasingFunctionNames)[number];

export const easingFunctions: { [key in EasingFunctionName]: EasingFunction } =
	{
		linear: (t) => t,
		easeInQuad: (t) => t * t,
		easeOutQuad: (t) => t * (2 - t),
		easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
		easeInCubic: (t) => t * t * t,
		easeOutCubic: (t) => {
			const t1 = t - 1;
			return t1 * t1 * t1 + 1;
		},
		easeInOutCubic: (t) =>
			t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
		easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
	};

/**
 * Applies a composite easing function with distinct ease-in, linear, and ease-out phases.
 */
export const applyCompositeEasing = (
	progress: number,
	easeInRatio: number,
	easeOutRatio: number,
	easeInFn: EasingFunction,
	easeOutFn: EasingFunction,
): number => {
	const linearRatio = 1 - easeInRatio - easeOutRatio;
	const easeInEnd = easeInRatio;
	const linearEnd = easeInRatio + linearRatio;

	if (progress <= easeInEnd) {
		if (easeInRatio === 0) return 0;
		const phaseProgress = progress / easeInRatio;
		return easeInFn(phaseProgress) * easeInRatio;
	}

	if (progress <= linearEnd) {
		if (linearRatio === 0) return easeInRatio;
		const phaseProgress = (progress - easeInRatio) / linearRatio;
		const linearValue = phaseProgress * linearRatio;
		return easeInRatio + linearValue;
	}

	if (easeOutRatio === 0) return 1;
	const phaseProgress = (progress - linearEnd) / easeOutRatio;
	return linearEnd + easeOutFn(phaseProgress) * (1 - linearEnd);
};

export const SmoothingTechniques = [
	"catmullRom",
	"movingAverage",
	"bSpline",
] as const;
export type SmoothingTechnique = (typeof SmoothingTechniques)[number];

/**
 * Smoothes a path by applying a simple moving average to the points.
 * @param points The array of points to smooth.
 * @param windowSize The size of the averaging window.
 * @returns An array of smoothed points.
 */
export const smoothWithMovingAverage = (
	points: Point[],
	windowSize = 5,
): Point[] => {
	if (points.length < windowSize) {
		return points;
	}

	const smoothedPoints: Point[] = [];
	for (let i = 0; i < points.length; i++) {
		const windowStart = Math.max(0, i - Math.floor(windowSize / 2));
		const windowEnd = Math.min(points.length, i + Math.ceil(windowSize / 2));

		let sumX = 0;
		let sumY = 0;
		for (let j = windowStart; j < windowEnd; j++) {
			sumX += points[j].x;
			sumY += points[j].y;
		}

		smoothedPoints.push({
			...points[i],
			x: sumX / (windowEnd - windowStart),
			y: sumY / (windowEnd - windowStart),
		});
	}
	return smoothedPoints;
};

/**
 * Generates an SVG path string for a B-spline.
 * Note: This is a simplified implementation for visualization.
 * It creates quadratic Bezier curve segments between points.
 * @param points The array of points for the spline.
 * @returns An SVG path data string.
 */
export const generateBSplinePath = (points: Point[]): string => {
	if (points.length < 3) {
		return generateCatmullRomPath(points); // Fallback for short paths
	}

	let path = `M ${points[0].x} ${points[0].y}`;
	for (let i = 0; i < points.length - 2; i++) {
		const p0 = points[i];
		const p1 = points[i + 1];
		const p2 = points[i + 2];

		const cp1x = (p0.x + p1.x) / 2;
		const cp1y = (p0.y + p1.y) / 2;

		const cp2x = (p1.x + p2.x) / 2;
		const cp2y = (p1.y + p2.y) / 2;

		path += ` Q ${cp1x},${cp1y} ${p1.x},${p1.y}`;
		if (i === points.length - 3) {
			path += ` Q ${cp2x},${cp2y} ${p2.x},${p2.y}`;
		}
	}
	return path;
};
