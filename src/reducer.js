import { createSlice } from "redux-starter-kit";

const { reducer, actions } = createSlice({
  initialState: { mode: "search", data: [] },
  reducers: {
    loading(state, { payload }) {
      return { mode: "loading", progress: 0, data: [], name: payload.name };
    },
    loadedLocation(state, { payload }) {
      state.progress++;
      state.location = payload.address.city || payload.display_name;
    },
    error() {
      return { mode: "error" };
    },
    loadedData(state, { payload }) {
      state.progress++;
      state.data.push(...payload);
    },
    finishedLoading(state) {
      state.mode = "success";
    }
  }
});

const fetchAPI = async (...args) => {
  const response = await fetch(...args);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Something went wrong");
  }
};

const stepBackThroughTime = (from, to, by, cb) => {
  // round the end date up to avoid off-by-one error
  const end = from - Math.ceil((from - to) / by) * by;
  const results = [];
  for (let start = from - by; start >= end; start -= by) {
    results.push(cb(new Date(start), new Date(Math.max(start + by, to))));
  }
  return results;
};

export const render = location => async dispatch => {
  dispatch(actions.loading({ name: location }));

  try {
    const locationData = await fetchAPI(
      `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_TOKEN}&q=${location}&format=json&addressdetails=1&limit=1`
    );
    dispatch(actions.loadedLocation(locationData[0]));
    const now = Date.now();

    const dayInMs = 24 * 60 * 60 * 1000;

    await Promise.all(
      stepBackThroughTime(
        now,
        now - 365 * dayInMs,
        10 * dayInMs,
        (start, end) =>
          fetchAPI(
            `https://api.stormglass.io/v1/weather/point?lat=${
              locationData[0].lat
            }&lng=${
              locationData[0].lon
            }&start=${start.toISOString()}&end=${end.toISOString()}&params=airTemperature,precipitation`,
            {
              headers: {
                Authorization: process.env.REACT_APP_STORMGLASS_TOKEN
              }
            }
          ).then(data => {
            dispatch(actions.loadedData(data.hours));
          })
      )
    );

    dispatch(actions.finishedLoading());
  } catch (e) {
    dispatch(actions.error());
  }
};

export default reducer;
