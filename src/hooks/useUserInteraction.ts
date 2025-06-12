import type { AnimationParams } from "@/lib/types";
import { useCallback, useState } from "react";
import type { useAnimationPlayback } from "./useAnimationPlayback";
import type { useMouseDrawing } from "./useMouseDrawing";
import type { usePathProcessing } from "./usePathProcessing";

interface UserInteractionProps {
	playback: ReturnType<typeof useAnimationPlayback>;
	drawing: ReturnType<typeof useMouseDrawing>;
	pathProcessing: ReturnType<typeof usePathProcessing>;
}

export function useUserInteraction({
	playback,
	drawing,
	pathProcessing,
}: UserInteractionProps) {
	const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

	const handleSelectSegment = useCallback((index: number) => {
		setSelectedSegmentIndex(index);
	}, []);

	const handleCurrentParamChange = useCallback(
		(newParams: AnimationParams) => {
			const updatedParams = [...pathProcessing.animationParams];
			updatedParams[selectedSegmentIndex] = newParams;

			pathProcessing.setAnimationParams((prev) => ({
				...prev,
				animationParams: updatedParams,
			}));
		},
		[pathProcessing, selectedSegmentIndex],
	);

	const handleClear = useCallback(() => {
		playback.handleStopAnimation();
		drawing.resetPoints();
		pathProcessing.resetPaths();
		setSelectedSegmentIndex(0);
	}, [playback, drawing, pathProcessing]);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent<SVGSVGElement>) => {
			if (playback.isPlaying) {
				playback.handleStopAnimation();
			}
			handleClear();
			drawing.handleMouseDown(e);
		},
		[playback, handleClear, drawing],
	);

	return {
		selectedSegmentIndex,
		handleSelectSegment,
		handleCurrentParamChange,
		handleClear,
		handleMouseDown,
	};
}
