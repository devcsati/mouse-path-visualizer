import { applyCompositeEasing, easingFunctions } from "@/lib/algorithms";
import { ANIMATION_DURATION_PER_SEGMENT } from "@/lib/constants";
import type { AnimationParams, Point } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnimationPlaybackProps {
	smoothedPaths: string[];
	animationParams: AnimationParams[];
	pauseDurations: number[];
	pathRefs: React.MutableRefObject<(SVGPathElement | null)[]>;
}

export function useAnimationPlayback({
	smoothedPaths,
	animationParams,
	pauseDurations,
	pathRefs,
}: AnimationPlaybackProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [cursorPos, setCursorPos] = useState<Point | null>(null);

	const animationFrameRef = useRef<number | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleStopAnimation = useCallback(() => {
		setIsPlaying(false);
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setCursorPos(null);
	}, []);

	const handlePlayAnimation = useCallback(() => {
		if (smoothedPaths.length === 0 || isPlaying) return;
		setIsPlaying(true);
	}, [smoothedPaths.length, isPlaying]);

	useEffect(() => {
		if (!isPlaying || smoothedPaths.length === 0) {
			return;
		}

		const startAnimationForSegment = (segmentIndex: number) => {
			const firstPath = pathRefs.current[segmentIndex];
			if (firstPath) {
				const point = firstPath.getPointAtLength(0);
				setCursorPos({ x: point.x, y: point.y, t: 0 });
			}

			let startTime: number | null = null;
			const durationPerSegment = ANIMATION_DURATION_PER_SEGMENT;

			const animate = (timestamp: number) => {
				if (startTime === null) {
					startTime = timestamp;
				}
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / durationPerSegment, 1);

				const currentPath = pathRefs.current[segmentIndex];
				const currentParams = animationParams[segmentIndex];

				if (currentPath && currentParams) {
					const pathLength = currentPath.getTotalLength();
					const easedProgress = applyCompositeEasing(
						progress,
						currentParams.easeInRatio,
						currentParams.easeOutRatio,
						easingFunctions[currentParams.easeInFn],
						easingFunctions[currentParams.easeOutFn],
					);
					const distance = pathLength * easedProgress;
					const point = currentPath.getPointAtLength(distance);
					setCursorPos({ x: point.x, y: point.y, t: 0 });
				}

				if (progress < 1) {
					animationFrameRef.current = requestAnimationFrame(animate);
				} else {
					if (segmentIndex < smoothedPaths.length - 1) {
						const pause = pauseDurations[segmentIndex] || 0;
						timeoutRef.current = setTimeout(() => {
							startAnimationForSegment(segmentIndex + 1);
						}, pause);
					} else {
						handleStopAnimation();
					}
				}
			};
			animationFrameRef.current = requestAnimationFrame(animate);
		};

		startAnimationForSegment(0);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [
		isPlaying,
		smoothedPaths,
		animationParams,
		pauseDurations,
		pathRefs,
		handleStopAnimation,
	]);

	return {
		isPlaying,
		cursorPos,
		handlePlayAnimation,
		handleStopAnimation,
	};
}
