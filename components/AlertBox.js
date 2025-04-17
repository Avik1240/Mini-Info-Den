import styles from "../styles/AlertBox.module.css";

export default function AlertBox({ message }) {
  return (
    <div className={styles.alert}>
      <p>{message}</p>
    </div>
  );
}
