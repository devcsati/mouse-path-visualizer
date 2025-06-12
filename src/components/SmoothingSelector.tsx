import { type SmoothingTechnique, SmoothingTechniques } from "@/lib/algorithms";
import type React from "react";
import styles from "./SmoothingSelector.module.css";

type SmoothingSelectorProps = {
	selectedTechnique: SmoothingTechnique;
	onSelectTechnique: (technique: SmoothingTechnique) => void;
	disabled: boolean;
};

const techniqueLabels: Record<SmoothingTechnique, string> = {
	catmullRom: "Catmull-Rom Spline",
	movingAverage: "Moving Average",
	bSpline: "B-Spline",
};

const SmoothingSelector: React.FC<SmoothingSelectorProps> = ({
	selectedTechnique,
	onSelectTechnique,
	disabled,
}) => {
	return (
		<div className={styles.container}>
			<label htmlFor="smoothing-selector" className={styles.label}>
				Smoothing Technique:
			</label>
			<select
				id="smoothing-selector"
				value={selectedTechnique}
				onChange={(e) =>
					onSelectTechnique(e.target.value as SmoothingTechnique)
				}
				disabled={disabled}
				className={styles.select}
			>
				{SmoothingTechniques.map((technique) => (
					<option key={technique} value={technique}>
						{techniqueLabels[technique]}
					</option>
				))}
			</select>
		</div>
	);
};

export default SmoothingSelector;
