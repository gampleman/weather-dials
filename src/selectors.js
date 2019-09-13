export const computeDailyAverages = data => {
  // Step 1: Compute hourly averages:
  return (
    Object.values(
      data
        .map(hour => ({
          day: hour.time.split("T")[0],
          time: hour.time,
          airTemperature:
            hour.airTemperature.reduce(
              (sum, current) => sum + current.value,
              0
            ) / hour.airTemperature.length,
          precipitation:
            hour.precipitation.reduce(
              (sum, current) => sum + current.value,
              0
            ) / hour.precipitation.length
        }))
        // Step 2: Group by day
        .reduce((index, hour) => {
          let curr = index[hour.day] || {
            ...hour,
            airTemperature: {
              min: hour.airTemperature,
              max: hour.airTemperature,
              sum: 0,
              count: 0
            },
            precipitation: {
              min: hour.precipitation,
              max: hour.precipitation,
              sum: 0,
              count: 0
            }
          };
          curr.airTemperature.max = Math.max(
            curr.airTemperature.max,
            hour.airTemperature
          );
          curr.airTemperature.min = Math.min(
            curr.airTemperature.min,
            hour.airTemperature
          );
          curr.airTemperature.sum =
            curr.airTemperature.sum + hour.airTemperature;
          curr.airTemperature.count += 1;

          curr.precipitation.max = Math.max(
            curr.precipitation.max,
            hour.precipitation
          );
          curr.precipitation.min = Math.min(
            curr.precipitation.min,
            hour.precipitation
          );
          curr.precipitation.sum = curr.precipitation.sum + hour.precipitation;
          curr.precipitation.count += 1;

          return { ...index, [hour.day]: curr };
        }, {})
    )
      // Step 3: compute daily averages
      .map(daily => ({
        day: daily.day,
        airTemperature: {
          ...daily.airTemperature,
          avg: daily.airTemperature.sum / daily.airTemperature.count
        },
        precipitation: {
          ...daily.precipitation,
          avg: daily.precipitation.sum / daily.precipitation.count
        }
      }))
  );
};
