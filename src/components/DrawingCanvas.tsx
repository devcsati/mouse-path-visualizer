import type { Point } from "@/lib/types";
import type React from "react";
import styles from "./DrawingCanvas.module.css";

type DrawingCanvasProps = {
	points: Point[];
	smoothedPaths: string[];
	cursorPos: Point | null;
	pathRefs: React.MutableRefObject<(SVGPathElement | null)[]>;
	onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
	onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
	onDrawingEnd: (e: React.MouseEvent<SVGSVGElement>) => void;
};

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
	points,
	smoothedPaths,
	cursorPos,
	pathRefs,
	onMouseDown,
	onMouseMove,
	onDrawingEnd,
}) => (
	<div className={styles.canvasContainer}>
		<svg
			width="100%"
			height="100%"
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onDrawingEnd}
			onMouseLeave={onDrawingEnd}
		>
			<title>Drawing Area</title>

			<polyline
				points={points.map((p) => `${p.x},${p.y}`).join(" ")}
				fill="none"
				stroke="rgba(0, 0, 0, 0.4)"
				strokeWidth="1.5"
				strokeDasharray="4 2"
			/>

			{smoothedPaths.map((pathData, index) => (
				<path
					key={pathData}
					ref={(el) => {
						pathRefs.current[index] = el;
					}}
					d={pathData}
					fill="none"
					stroke="royalblue"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			))}

			{cursorPos && (
				<circle
					cx={cursorPos.x}
					cy={cursorPos.y}
					r="8"
					fill="orange"
					stroke="white"
					strokeWidth="2"
				/>
			)}
		</svg>
	</div>
);

export default DrawingCanvas;
