import {
	type SmoothingTechnique,
	generateBSplinePath,
	generateCatmullRomPath,
	segmentPoints,
	smoothWithMovingAverage,
} from "@/lib/algorithms";
import { DEFAULT_ANIMATION_PARAMS, TIME_THRESHOLD } from "@/lib/constants";
import type { AnimationParams, Point, Segment } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

interface PathData {
	segments: Segment[];
	smoothedPaths: string[];
	animationParams: AnimationParams[];
	pauseDurations: number[];
}

const generateSmoothedPath = (
	segment: Segment,
	technique: SmoothingTechnique,
): string => {
	switch (technique) {
		case "movingAverage": {
			const smoothedPoints = smoothWithMovingAverage(segment);
			return generateCatmullRomPath(smoothedPoints); // Or a simple line generator
		}
		case "bSpline":
			return generateBSplinePath(segment);
		default:
			return generateCatmullRomPath(segment);
	}
};

export function usePathProcessing(
	isDrawing: boolean,
	points: Point[],
	smoothingTechnique: SmoothingTechnique,
) {
	const [pathData, setPathData] = useState<PathData>({
		segments: [],
		smoothedPaths: [],
		animationParams: [],
		pauseDurations: [],
	});

	const processPoints = useCallback(() => {
		const newSegments = segmentPoints(points, TIME_THRESHOLD);
		const newPaths = newSegments.map((segment) =>
			generateSmoothedPath(segment, smoothingTechnique),
		);

		const newAnimationParams = Array.from(
			{ length: newSegments.length },
			(_, index) => ({
				id: `seg-${Date.now()}-${index}`,
				...DEFAULT_ANIMATION_PARAMS,
			}),
		);

		let newPauseDurations: number[] = [];
		if (newSegments.length > 1) {
			newPauseDurations = newSegments.slice(0, -1).map((segment, index) => {
				const lastPointOfCurrent = segment[segment.length - 1];
				const firstPointOfNext = newSegments[index + 1][0];
				return firstPointOfNext.t - lastPointOfCurrent.t;
			});
		}

		setPathData({
			segments: newSegments,
			smoothedPaths: newPaths,
			animationParams: newAnimationParams,
			pauseDurations: newPauseDurations,
		});
	}, [points, smoothingTechnique]);

	useEffect(() => {
		if (!isDrawing && points.length > 1) {
			processPoints();
		}
	}, [isDrawing, points.length, processPoints]);

	const resetPaths = useCallback(() => {
		setPathData({
			segments: [],
			smoothedPaths: [],
			animationParams: [],
			pauseDurations: [],
		});
	}, []);

	return { ...pathData, setAnimationParams: setPathData, resetPaths };
}
