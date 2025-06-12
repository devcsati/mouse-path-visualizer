import { applyCompositeEasing, easingFunctions } from "@/lib/algorithms";
import type { AnimationParams } from "@/lib/types";
import type React from "react";
import styles from "./EasingGraph.module.css";

type EasingGraphProps = {
	params: AnimationParams[];
};

const EasingGraph: React.FC<EasingGraphProps> = ({ params }) => {
	const segmentCount = params.length;
	if (segmentCount === 0) {
		return null;
	}

	const totalWidth = 800;
	const height = 100;

	const segmentWidth = totalWidth / segmentCount;
	const padding = segmentWidth * 0.1;
	const graphWidth = segmentWidth - 2 * padding;

	const generatePathData = (currentParams: AnimationParams) => {
		const points = [];
		const easeInFn = easingFunctions[currentParams.easeInFn];
		const easeOutFn = easingFunctions[currentParams.easeOutFn];

		for (let i = 0; i <= graphWidth; i++) {
			const progress = i / graphWidth;
			const easedValue = applyCompositeEasing(
				progress,
				currentParams.easeInRatio,
				currentParams.easeOutRatio,
				easeInFn,
				easeOutFn,
			);
			points.push(`${i},${height - easedValue * height}`);
		}
		return `M ${points.join(" L ")}`;
	};

	return (
		<div className={styles.graphContainer}>
			<svg
				width="100%"
				height={height}
				viewBox={`0 0 ${totalWidth} ${height}`}
				preserveAspectRatio="none"
			>
				<title>Segment Animation Profiles</title>
				{params.map((segmentParams, index) => {
					const pathData = generatePathData(segmentParams);
					const easeInEnd = segmentParams.easeInRatio * graphWidth;
					const linearEnd = (1 - segmentParams.easeOutRatio) * graphWidth;

					return (
						<g
							key={segmentParams.id}
							transform={`translate(${index * segmentWidth + padding}, 0)`}
						>
							{/* Background Grid */}
							<line
								x1={easeInEnd}
								y1="0"
								x2={easeInEnd}
								y2={height}
								stroke="#fca5a5"
								strokeWidth="1"
								strokeDasharray="4 2"
							/>
							<line
								x1={linearEnd}
								y1="0"
								x2={linearEnd}
								y2={height}
								stroke="#fca5a5"
								strokeWidth="1"
								strokeDasharray="4 2"
							/>

							{/* Easing Curve */}
							<path
								d={pathData}
								fill="none"
								stroke="royalblue"
								strokeWidth="2"
							/>
						</g>
					);
				})}
			</svg>
			<div className={styles.caption}>
				Animation Profile per Segment (Red lines mark phase transitions)
			</div>
		</div>
	);
};

export default EasingGraph;
