import React from "react";
import styles from "./Header.module.css";

const Header = () => (
	<div className={styles.header}>
		<h1 className={styles.title}>Mouse Path Visualizer</h1>
		<p className={styles.subtitle}>
			Click and drag to draw. The dashed line is your raw input, the blue line
			is the smoothed path.
		</p>
	</div>
);

export default Header;
