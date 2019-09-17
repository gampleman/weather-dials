const mean = (arr, fn = a => a) =>
  arr.reduce((sum, current) => sum + fn(current), 0) / arr.length;

const groupBy = (arr, fn) => [
  ...arr
    .reduce((index, item) => {
      const key = fn(item);
      let items = index.get(key) || [];
      items.push(item);
      index.set(key, items);
      return index;
    }, new Map())
    .values()
];

const computeDescriptiveStats = (arr, fn) => {
  const summary = arr.reduce(
    (stats, item) => {
      const value = fn(item);
      return {
        min: Math.min(value, stats.min),
        max: Math.max(value, stats.max),
        sum: value + stats.sum,
        count: stats.count + 1
      };
    },
    {
      min: Infinity,
      max: -Infinity,
      sum: 0,
      count: 0
    }
  );
  summary.avg = summary.sum / summary.count;
  return summary;
};

export const computeDailyAverages = ({ data }) =>
  groupBy(
    data.map(hour => ({
      day: hour.time.split("T")[0],
      time: hour.time,
      airTemperature: mean(hour.airTemperature, a => a.value),
      precipitation: mean(hour.precipitation, a => a.value)
    })),
    hour => hour.day
  ).map(daily => ({
    day: daily[0].day,
    airTemperature: computeDescriptiveStats(daily, day => day.airTemperature),
    precipitation: computeDescriptiveStats(daily, day => day.precipitation)
  }));
