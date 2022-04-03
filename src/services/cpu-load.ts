import os from "os";

export const getCpuLoad = (): number => {
  const cpus = os.cpus().length;
  const cpuLoadAverage = os.loadavg()[0] / cpus;
  return cpuLoadAverage;
};
