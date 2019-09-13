import reducer, { render } from "./reducer";
import { configureStore } from "redux-starter-kit";

describe("reducer", () => {
  let store;
  let states;
  let unsubscribe;
  const realDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    store = configureStore({ reducer });
    states = [store.getState()];
    unsubscribe = store.subscribe(() => {
      states.push(store.getState());
    });

    const dateNowStub = jest.fn(() =>
      new Date("2019-09-14T11:01:58.135Z").valueOf()
    );
    global.Date.now = dateNowStub;
  });
  afterEach(() => {
    unsubscribe();
    global.Date.now = realDateNow;
  });

  it("starts in search mode", () => {
    expect(store.getState().mode).toEqual("search");
  });

  describe("render action", () => {
    const mockHappyPath = () => {
      fetch
        .mockResponseOnce(
          JSON.stringify([
            {
              lat: "55.9521476",
              lon: "-3.1889908",
              display_name:
                "Edinburgh, City of Edinburgh, Scotland, EH1 1BB, United Kingdom",
              class: "place",
              type: "city",
              address: {}
            }
          ])
        )
        .mockResponseOnce(
          JSON.stringify({
            hours: [
              {
                airTemperature: [
                  {
                    source: "sg",
                    value: 13.4
                  }
                ],

                precipitation: [
                  {
                    source: "sg",
                    value: 0.0
                  }
                ],

                time: "2019-09-04T11:01:58+00"
              }
            ]
          })
        );
    };
    it("set's the mode to loading", async () => {
      mockHappyPath();
      await store.dispatch(render("Edinburgh"));
      expect(states[1].mode).toEqual("loading");
      expect(states[1].progress).toEqual(0);
    });

    it("calls an external API for forward geocoding", async () => {
      mockHappyPath();
      await store.dispatch(render("Edinburgh"));
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /locationiq\.com\/v1\/search\.php\?.+q=Edinburgh&format=json/
        )
      );
    });

    it("updates the store with location information on success", async () => {
      mockHappyPath();
      await store.dispatch(render("Edinburgh"));
      expect(states[2].progress).toEqual(1);
      expect(states[2].location).toEqual(
        "Edinburgh, City of Edinburgh, Scotland, EH1 1BB, United Kingdom"
      );
    });

    it("transitions to the error state on failure", async () => {
      fetch.mockResponseOnce("", { status: 404 });
      await store.dispatch(render("Edinburgh"));
      expect(states[2].mode).toEqual("error");
    });

    it("then requests the last 10 days of weather data", async () => {
      mockHappyPath();

      await store.dispatch(render("Edinburgh"));
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /api\.stormglass\.io\/v1\/weather\/point\?lat=55\.9521476&lng=-3\.1889908&start=2019-09-04T11:01:58.135Z&end=2019-09-14T11:01:58.135Z/
        )
      );
    });

    it("plops the weather data into the store", async () => {
      mockHappyPath();

      await store.dispatch(render("Edinburgh"));
      expect(states[4].mode).toEqual("success");
      expect(states[4].data).toEqual([
        {
          airTemperature: [
            {
              source: "sg",
              value: 13.4
            }
          ],

          precipitation: [
            {
              source: "sg",
              value: 0.0
            }
          ],

          time: "2019-09-04T11:01:58+00"
        }
      ]);
    });
  });
});
