import { configureStore } from "redux-starter-kit";

import reducer from "./reducer";

const store = configureStore({
  reducer
});

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./reducer", () => {
    const newRootReducer = require("./reducer").default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
