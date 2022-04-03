import { useState } from 'react';
import { useInterval } from './useInterval';


export type DataPoint = {
  date: Date,
  value: number
}

const fetchDataPoint = async () => {
  const response = await fetch('/api/cpu/load');
  const data = await response.json();
  return data;
}

export const useGetCPULoad = (shouldMockHighLoad: boolean) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [firstCallDone, setFirstCallDone] = useState(false);

  const mockHighLoad = shouldMockHighLoad ? 1 : 0;

  useInterval(async () => {
    const dataPoint = await fetchDataPoint();
    setData(points => [...points, {date: new Date(), value: dataPoint.cpuLoadAverage + mockHighLoad}]);
    setFirstCallDone(true);
  }, firstCallDone ? 10000 : 0)

  const lastCPULoadValue = data.length ? data[data.length - 1].value + mockHighLoad : 0;

  return {
    data,
    lastCPULoadValue
  }
}