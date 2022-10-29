import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <span style={{ fontFamily: "monospace" }}>
      <span className={[styles.dot, styles.d1].join(" ")}>.</span>
      <span className={[styles.dot, styles.d2].join(" ")}>.</span>
      <span className={[styles.dot, styles.d3].join(" ")}>.</span>
      <span className={[styles.dot, styles.d4].join(" ")}>.</span>
    </span>
  );
};
