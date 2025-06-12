import type React from "react";
import styles from "./Controls.module.css";

type ControlsProps = {
	isPlaying: boolean;
	hasPaths: boolean;
	onPlay: () => void;
	onStop: () => void;
	onClear: () => void;
};

const Controls: React.FC<ControlsProps> = ({
	isPlaying,
	hasPaths,
	onPlay,
	onStop,
	onClear,
}) => (
	<div className={styles.controls}>
		{!isPlaying ? (
			<button
				onClick={onPlay}
				disabled={!hasPaths}
				className={`${styles.button} ${styles.playButton}`}
				type="button"
			>
				Play Animation
			</button>
		) : (
			<button
				onClick={onStop}
				className={`${styles.button} ${styles.stopButton}`}
				type="button"
			>
				Stop Animation
			</button>
		)}
		<button
			onClick={onClear}
			type="button"
			className={`${styles.button} ${styles.clearButton}`}
		>
			Clear
		</button>
	</div>
);

export default Controls;
