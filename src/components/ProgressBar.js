import React from "react";

const ProgressBar = ({ progress }) => (
  <div>
    <progress max={38} value={progress} />
    <p>Loading all the data...</p>
  </div>
);

export default ProgressBar;
