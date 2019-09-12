import React from "react";

const LocationSearch = props => {
  const autocomplete = () => null;
  return (
    <div>
      <label>
        City:
        <input type="text" onChange={autocomplete} />
      </label>
    </div>
  );
};

export default LocationSearch;
