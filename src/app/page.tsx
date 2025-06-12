"use client";

import Controls from "@/components/Controls";
import DrawingCanvas from "@/components/DrawingCanvas";
import EasingGraph from "@/components/EasingGraph";
import Header from "@/components/Header";
import ParameterControls from "@/components/ParameterControls";
import SegmentSelector from "@/components/SegmentSelector";
import SmoothingSelector from "@/components/SmoothingSelector";
import { AnimationProvider, useAnimation } from "@/context/AnimationContext";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

function AnimationPageContent() {
	const {
		points,
		segments,
		smoothedPaths,
		isPlaying,
		cursorPos,
		animationParams,
		selectedSegmentIndex,
		pathRefs,
		handleMouseDown,
		handleMouseMove,
		handleMouseUpOrLeave,
		handleClear,
		handlePlayAnimation,
		handleStopAnimation,
		handleSelectSegment,
		handleCurrentParamChange,
		smoothingTechnique,
		setSmoothingTechnique,
	} = useAnimation();

	const currentParams = animationParams[selectedSegmentIndex];

	return (
		<main className={styles.main}>
			<div className={styles.sidebar}>
				<Header />
				<div className={styles.controlsWrapper}>
					<Controls
						isPlaying={isPlaying}
						hasPaths={smoothedPaths.length > 0}
						onPlay={handlePlayAnimation}
						onStop={handleStopAnimation}
						onClear={handleClear}
					/>
					<SmoothingSelector
						selectedTechnique={smoothingTechnique}
						onSelectTechnique={setSmoothingTechnique}
						disabled={isPlaying}
					/>
					<SegmentSelector
						segmentCount={segments.length}
						selectedSegmentIndex={selectedSegmentIndex}
						onSelectSegment={handleSelectSegment}
						disabled={isPlaying}
					/>
					{currentParams && (
						<ParameterControls
							params={currentParams}
							setParams={handleCurrentParamChange}
							isPlaying={isPlaying}
						/>
					)}
				</div>
			</div>

			<div className={styles.content}>
				<DrawingCanvas
					points={points}
					smoothedPaths={smoothedPaths}
					cursorPos={cursorPos}
					pathRefs={pathRefs}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onDrawingEnd={handleMouseUpOrLeave}
				/>
				<EasingGraph params={animationParams} />
			</div>
		</main>
	);
}

export default function Home() {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	return (
		<AnimationProvider>
			<AnimationPageContent />
		</AnimationProvider>
	);
}
