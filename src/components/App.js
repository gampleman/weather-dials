import React from "react";
import LocationSearch from "./LocationSearch";
import { useDispatch, useSelector } from "react-redux";
import { render } from "../reducer";

function App() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  switch (state.mode) {
    case "search":
      return (
        <LocationSearch onRender={location => dispatch(render(location))} />
      );
    case "loading":
      return <p>loading</p>;
    case "success":
      return <pre>{JSON.stringify(state.data, null, 2)}</pre>;
    case "error":
      return <p>Something went wrong</p>;
  }
}

export default App;
