import React from "react";
import LocationSearch from "./LocationSearch";
import Dial from "./Dial";
import ProgressBar from "./ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { render } from "../reducer";
import { computeDailyAverages } from "../selectors";
import styles from "./App.module.css";

const App = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  switch (state.mode) {
    case "search":
      return (
        <LocationSearch onRender={location => dispatch(render(location))} />
      );
    case "loading":
      return <ProgressBar progress={state.progress} />;
    case "success":
      return <Dial data={computeDailyAverages(state)} name={state.name} />;
    case "error":
    default:
      return <p>Something went wrong.</p>;
  }
};

const StyledApp = () => (
  <main className={styles.app}>
    <App />
  </main>
);

export default StyledApp;
