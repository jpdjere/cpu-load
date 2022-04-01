import { useEffect, useState } from "react";

export const useAlerts = (cpuLoad: number) => {
  const twoMinutesInDataPoints = 12;

  const [consecutiveHighs, setConsecutiveHighs] = useState(0);
  const [consecutiveLows, setConsecutiveLows] = useState(0);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    if(cpuLoad > 1) {
      setConsecutiveHighs(consecutiveHighs + 1);
      setConsecutiveLows(0);
      if (consecutiveHighs + 1 >= twoMinutesInDataPoints) {
        setIsAlert(true);
      }
    } else if(cpuLoad < 1) {
      setConsecutiveHighs(0);
      setConsecutiveLows(consecutiveLows + 1);
      if (consecutiveLows + 1 >= twoMinutesInDataPoints) {
        setIsAlert(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuLoad]);

  return {
    isAlert,
    consecutiveHighs,
    consecutiveLows
  }

}