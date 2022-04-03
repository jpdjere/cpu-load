import { useState } from "react";
import { useInterval } from "./useInterval";
import { TEN_SECONDS_IN_MS, DATA_POINT_LIMIT } from "../constants";

export type DataPoint = {
  date: Date;
  value: number;
};

const fetchDataPoint = async () => {
  const response = await fetch("/api/cpu/load");
  const data = await response.json();
  return data;
};

export const useGetCPULoad = (shouldMockHighLoad: boolean) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [firstCallDone, setFirstCallDone] = useState(false);
  const [sliceData, setSliceData] = useState<number | undefined>(undefined);

  const mockHighLoad = shouldMockHighLoad ? 1 : 0;

  const initialCPULoad = data.length
    ? data[data.length - 1].value + mockHighLoad
    : 0;
  const [lastCPULoadValue, setLastCPULoadValue] = useState(initialCPULoad);

  useInterval(
    async () => {
      const dataPoint = await fetchDataPoint();
      if (data.length === DATA_POINT_LIMIT) {
        setSliceData(1);
      }
      setData((points) =>
        [
          ...points,
          { date: new Date(), value: dataPoint.cpuLoadAverage + mockHighLoad },
        ].slice(sliceData)
      );
      setFirstCallDone(true);
      setLastCPULoadValue(dataPoint.cpuLoadAverage + mockHighLoad);
    },
    firstCallDone ? TEN_SECONDS_IN_MS : 0
  );

  return {
    data,
    lastCPULoadValue,
  };
};
