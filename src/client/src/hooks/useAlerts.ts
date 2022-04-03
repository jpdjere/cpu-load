import { useEffect, useState } from "react";
import { DATA_POINTS_IN_TWO_MINUTES } from "../constants";

type AlertPhase = {
  start: Date;
  end?: Date;
};

type DefaultInitialValues = {
  defaultConsecutiveHighs: number;
  defaultConsecutiveLows: number;
  defaultAlertsAmount: number;
  defaultRecoveryAmount: number;
  defaultIsAlert: boolean;
  defaultAlertPhases: AlertPhase[];
};

export const useAlerts = (
  cpuLoad: number,
  defaults: Partial<DefaultInitialValues> = {}
) => {
  const {
    defaultConsecutiveHighs,
    defaultConsecutiveLows,
    defaultAlertsAmount,
    defaultRecoveryAmount,
    defaultIsAlert,
    defaultAlertPhases,
  } = defaults;
  const [consecutiveHighs, setConsecutiveHighs] = useState(
    defaultConsecutiveHighs || 0
  );
  const [consecutiveLows, setConsecutiveLows] = useState(
    defaultConsecutiveLows || 0
  );
  const [alertsAmount, setAlertsAmount] = useState(defaultAlertsAmount || 0);
  const [recoveryAmount, setRecoveryAmount] = useState(
    defaultRecoveryAmount || 0
  );
  const [isAlert, setIsAlert] = useState(defaultIsAlert || false);

  const [alertPhases, setAlertPhases] = useState<AlertPhase[]>(
    defaultAlertPhases || []
  );

  useEffect(() => {
    if (cpuLoad >= 1) {
      setConsecutiveHighs(consecutiveHighs + 1);
      setConsecutiveLows(0);
      if (consecutiveHighs + 1 === DATA_POINTS_IN_TWO_MINUTES) {
        setIsAlert(true);
        setAlertsAmount(alertsAmount + 1);
        setAlertPhases((alertPhases) => [
          { start: new Date() },
          ...alertPhases,
        ]);
      }
    } else {
      setConsecutiveHighs(0);
      setConsecutiveLows(consecutiveLows + 1);
      if (consecutiveLows + 1 === DATA_POINTS_IN_TWO_MINUTES) {
        setIsAlert(false);
        setRecoveryAmount(recoveryAmount + 1);
        setAlertPhases((alertPhases) => {
          const lastAlertPhase = alertPhases[0];
          const previousAlertPhases = alertPhases.slice(
            0,
            alertPhases.length - 1
          );
          const newAlertPhases = [
            { ...lastAlertPhase, end: new Date() },
            ...previousAlertPhases,
          ];
          return newAlertPhases;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuLoad]);

  return {
    isAlert,
    consecutiveHighs,
    consecutiveLows,
    alertsAmount,
    recoveryAmount,
    alertPhases,
  };
};
