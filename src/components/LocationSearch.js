import React, { useRef, useState } from "react";
import styles from "./LocationSearch.module.css";
let currentId = 0;

const useId = () => {
  const ref = useRef(0);
  if (ref.current === 0) {
    ref.current = ++currentId;
  }
  return "id-" + ref.current;
};

const LocationSearch = ({ onRender }) => {
  const inputId = useId();
  const [value, setValue] = useState("");
  return (
    <div>
      <h1 className={styles.header}>Make a weather dial!</h1>
      <div className={styles.form}>
        <label htmlFor={inputId}>City:</label>
        <input
          id={inputId}
          autoFocus={true}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button className={styles.button} onClick={() => onRender(value)}>
          Render
        </button>
      </div>
    </div>
  );
};

export default LocationSearch;
