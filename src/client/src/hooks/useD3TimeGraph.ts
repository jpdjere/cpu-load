import { useEffect } from "react";
import { startD3 } from "../utils/d3";
import { DataPoint } from "./useGetCPULoad";

const d3 = startD3();

export const useD3TimeGraph = (data: DataPoint[]) => {
  useEffect(() => {
    d3.createGraph(data);
  }, []);

  useEffect(() => {
    d3.updateGraph(data);
  }, [data]);
};
