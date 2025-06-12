"use client";

import type { SmoothingTechnique } from "@/lib/algorithms";
import type { AnimationParams, Point, Segment } from "@/lib/types";
import type React from "react";
import { createContext, useContext, useRef, useState } from "react";

import { useAnimationPlayback } from "@/hooks/useAnimationPlayback";
import { useMouseDrawing } from "@/hooks/useMouseDrawing";
import { usePathProcessing } from "@/hooks/usePathProcessing";
import { useUserInteraction } from "@/hooks/useUserInteraction";

interface AnimationContextType {
	// from useMouseDrawing
	isDrawing: boolean;
	points: Point[];
	handleMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
	handleMouseUpOrLeave: () => void;

	// from usePathProcessing
	segments: Segment[];
	smoothedPaths: string[];
	animationParams: AnimationParams[];

	// from useAnimationPlayback
	isPlaying: boolean;
	cursorPos: Point | null;
	handlePlayAnimation: () => void;
	handleStopAnimation: () => void;

	// from useUserInteraction
	selectedSegmentIndex: number;
	handleSelectSegment: (index: number) => void;
	handleCurrentParamChange: (newParams: AnimationParams) => void;
	handleClear: () => void;
	handleMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;

	// from context itself
	pathRefs: React.MutableRefObject<(SVGPathElement | null)[]>;
	smoothingTechnique: SmoothingTechnique;
	setSmoothingTechnique: (technique: SmoothingTechnique) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
	undefined,
);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [smoothingTechnique, setSmoothingTechnique] =
		useState<SmoothingTechnique>("catmullRom");
	const pathRefs = useRef<(SVGPathElement | null)[]>([]);

	const drawing = useMouseDrawing();
	const pathProcessing = usePathProcessing(
		drawing.isDrawing,
		drawing.points,
		smoothingTechnique,
	);

	const playback = useAnimationPlayback({
		smoothedPaths: pathProcessing.smoothedPaths,
		animationParams: pathProcessing.animationParams,
		pauseDurations: pathProcessing.pauseDurations,
		pathRefs,
	});

	const userInteraction = useUserInteraction({
		playback,
		drawing,
		pathProcessing,
	});

	const value = {
		...drawing,
		...pathProcessing,
		...playback,
		...userInteraction,
		pathRefs,
		smoothingTechnique,
		setSmoothingTechnique,
	};

	return (
		<AnimationContext.Provider value={value}>
			{children}
		</AnimationContext.Provider>
	);
};

export const useAnimation = () => {
	const context = useContext(AnimationContext);
	if (context === undefined) {
		throw new Error("useAnimation must be used within an AnimationProvider");
	}
	return context;
};
