import React, { useRef, useState } from "react";
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
      <label htmlFor={inputId}>City:</label>
      <input
        id={inputId}
        autoFocus={true}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={() => onRender(value)}>Render</button>
    </div>
  );
};

export default LocationSearch;
