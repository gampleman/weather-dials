import { computeDailyAverages } from "./selectors";

const mockData = [];
const start = new Date("2018-01-01T00:00:00Z").valueOf();
for (let i = 0; i < 365; i++) {
  const date = start + i * 24 * 60 * 60 * 1000;
  for (let j = 0; j < 24; j++) {
    const time = date + j * 60 * 60 * 1000;
    const baseTemp = i / 30 - 6 + (j % 3) + (j / 8 - 1.5);
    const basePrec = Math.floor((i % 47) / 2) + ((j % 2) - 1);
    mockData.push({
      airTemperature: [
        {
          source: "sg",
          value: 10 + baseTemp
        },
        {
          source: "meteo",
          value: 8 + baseTemp
        }
      ],
      precipitation: [
        {
          source: "sg",
          value: Math.max(0, -2 + basePrec)
        },

        {
          source: "meteo",
          value: Math.max(0, -8 + basePrec)
        }
      ],

      time: new Date(time).toISOString()
    });
  }
}

describe("computeDailyAverages", () => {
  it("coalesces it to a fixed number of days", () => {
    const result = computeDailyAverages({ data: mockData });
    expect(result.length).toBe(365);
    result.forEach(day => {
      expect(day).toEqual({
        day: expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/),
        airTemperature: {
          min: expect.any(Number),
          max: expect.any(Number),
          sum: expect.any(Number),
          avg: expect.any(Number),
          count: 24
        },
        precipitation: {
          min: expect.any(Number),
          max: expect.any(Number),
          sum: expect.any(Number),
          avg: expect.any(Number),
          count: 24
        }
      });
    });
  });
});
