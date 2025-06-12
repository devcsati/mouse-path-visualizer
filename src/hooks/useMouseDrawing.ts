import type { Point } from "@/lib/types";
import { useCallback, useRef, useState } from "react";

export function useMouseDrawing() {
	const [isDrawing, setIsDrawing] = useState(false);
	const [points, setPoints] = useState<Point[]>([]);
	const startTimeRef = useRef<number>(0);

	const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
		setIsDrawing(true);
		startTimeRef.current = performance.now();

		const svgRect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - svgRect.left;
		const y = e.clientY - svgRect.top;

		setPoints([{ x, y, t: 0 }]);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<SVGSVGElement>) => {
			if (!isDrawing) return;

			const svgRect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - svgRect.left;
			const y = e.clientY - svgRect.top;
			const t = performance.now() - startTimeRef.current;

			setPoints((prev) => [...prev, { x, y, t }]);
		},
		[isDrawing],
	);

	const handleMouseUpOrLeave = useCallback(() => {
		if (!isDrawing) return;
		setIsDrawing(false);
	}, [isDrawing]);

	const resetPoints = useCallback(() => {
		setPoints([]);
	}, []);

	return {
		isDrawing,
		points,
		handleMouseDown,
		handleMouseMove,
		handleMouseUpOrLeave,
		resetPoints,
	};
}
