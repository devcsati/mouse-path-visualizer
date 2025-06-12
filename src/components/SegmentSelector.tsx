import type React from "react";
import styles from "./SegmentSelector.module.css";

type SegmentSelectorProps = {
	segmentCount: number;
	selectedSegmentIndex: number;
	onSelectSegment: (index: number) => void;
	disabled: boolean;
};

const SegmentSelector: React.FC<SegmentSelectorProps> = ({
	segmentCount,
	selectedSegmentIndex,
	onSelectSegment,
	disabled,
}) => {
	if (segmentCount < 2) {
		return null; // Don't show the selector if there's only one segment (or none)
	}

	const segmentIndices = Array.from({ length: segmentCount }, (_, i) => i);

	return (
		<div className={styles.container}>
			<label htmlFor="segment-selector" className={styles.label}>
				Edit Animation Profile for Segment:
			</label>
			<select
				id="segment-selector"
				value={selectedSegmentIndex}
				onChange={(e) => onSelectSegment(Number(e.target.value))}
				disabled={disabled}
				className={styles.select}
			>
				{segmentIndices.map((index) => (
					<option key={`segment-option-${index}`} value={index}>
						Segment {index + 1}
					</option>
				))}
			</select>
		</div>
	);
};

export default SegmentSelector;
