import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import store from "./store";
import { Provider } from "react-redux";

const render = () => {
  const App = require("./App").default;

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", render);
}

serviceWorker.register();
