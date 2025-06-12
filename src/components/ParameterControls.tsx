import { type EasingFunctionName, EasingFunctionNames } from "@/lib/algorithms";
import type { AnimationParams } from "@/lib/types";
import type React from "react";
import styles from "./ParameterControls.module.css";

type ParameterControlsProps = {
	params: AnimationParams;
	setParams: (newParams: AnimationParams) => void;
	isPlaying: boolean;
};

const ParameterControls: React.FC<ParameterControlsProps> = ({
	params,
	setParams,
	isPlaying,
}) => {
	const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const newRatio = Number(value) / 100;

		const newParams = { ...params, [name]: newRatio };

		if (newParams.easeInRatio + newParams.easeOutRatio > 1) {
			if (name === "easeInRatio") {
				newParams.easeOutRatio = 1 - newParams.easeInRatio;
			} else {
				newParams.easeInRatio = 1 - newParams.easeOutRatio;
			}
		}
		setParams(newParams);
	};

	const handleFnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setParams({ ...params, [name]: value as EasingFunctionName });
	};

	const easeInFunctions = EasingFunctionNames.filter(
		(k) =>
			(k.toLowerCase().includes("in") && !k.toLowerCase().includes("out")) ||
			k === "linear",
	);
	const easeOutFunctions = EasingFunctionNames.filter(
		(k) =>
			(k.toLowerCase().includes("out") && !k.toLowerCase().includes("in")) ||
			k === "linear",
	);

	return (
		<div className={styles.container}>
			<div className={styles.title}>Animation Parameters</div>

			<div className={styles.controlGroup}>
				<h3 className={styles.groupTitle}>Ease-In</h3>
				<label htmlFor="easeInRatio" className={styles.label}>
					Duration: {Math.round(params.easeInRatio * 100)}%
				</label>
				<input
					type="range"
					id="easeInRatio"
					name="easeInRatio"
					min="0"
					max="100"
					value={params.easeInRatio * 100}
					onChange={handleRatioChange}
					disabled={isPlaying}
					className={styles.slider}
				/>
				<label htmlFor="easeInFn" className={styles.label}>
					Function
				</label>
				<select
					id="easeInFn"
					name="easeInFn"
					value={params.easeInFn}
					onChange={handleFnChange}
					disabled={isPlaying}
					className={styles.select}
				>
					{easeInFunctions.map((fnName) => (
						<option key={fnName} value={fnName}>
							{fnName}
						</option>
					))}
				</select>
			</div>

			<div className={styles.controlGroup}>
				<h3 className={styles.groupTitle}>Ease-Out</h3>
				<label htmlFor="easeOutRatio" className={styles.label}>
					Duration: {Math.round(params.easeOutRatio * 100)}%
				</label>
				<input
					type="range"
					id="easeOutRatio"
					name="easeOutRatio"
					min="0"
					max="100"
					value={params.easeOutRatio * 100}
					onChange={handleRatioChange}
					disabled={isPlaying}
					className={styles.slider}
				/>
				<label htmlFor="easeOutFn" className={styles.label}>
					Function
				</label>
				<select
					id="easeOutFn"
					name="easeOutFn"
					value={params.easeOutFn}
					onChange={handleFnChange}
					disabled={isPlaying}
					className={styles.select}
				>
					{easeOutFunctions.map((fnName) => (
						<option key={fnName} value={fnName}>
							{fnName}
						</option>
					))}
				</select>
			</div>

			<div className={styles.infoBox}>
				Linear (Constant Speed) Duration:{" "}
				{Math.round((1 - params.easeInRatio - params.easeOutRatio) * 100)}%
			</div>
		</div>
	);
};

export default ParameterControls;
