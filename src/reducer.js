import { createSlice } from "redux-starter-kit";

const { reducer, actions } = createSlice({
  initialState: { mode: "search" },
  reducers: {
    loading() {
      return { mode: "loading", progress: 0, data: [] };
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

export const render = location => async dispatch => {
  dispatch(actions.loading());

  try {
    const locationData = await fetchAPI(
      `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_TOKEN}&q=${location}&format=json&addressdetails=1&limit=1`
    );

    dispatch(actions.loadedLocation(locationData[0]));
    const now = new Date(Date.now());
    const before = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const last10daysWeather = await fetchAPI(
      `https://api.stormglass.io/v1/weather/point?lat=${
        locationData[0].lat
      }&lng=${
        locationData[0].lon
      }&start=${before.toISOString()}&end=${now.toISOString()}`,
      {
        headers: {
          Authorization: process.env.REACT_APP_STORMGLASS_TOKEN
        }
      }
    );
    dispatch(actions.loadedData(last10daysWeather.hours));
    dispatch(actions.finishedLoading());
  } catch (e) {
    dispatch(actions.error());
  }
};

export default reducer;
