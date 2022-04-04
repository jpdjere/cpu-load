import { FC } from "react";
import { AlertPhase } from "../hooks/useAlerts";

type AlertListProps = {
  alertPhases: AlertPhase[];
};

export const AlertList: FC<AlertListProps> = ({ alertPhases }) => {
  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-lg p-6">
      <div className="px-4 py-5 sm:px-6 border-b w-full">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Alerts History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Time periods in which your system triggered an alert due to high CPU
          load.
        </p>
      </div>
      <ul className="flex flex-col divide divide-y w-full">
        {alertPhases.map(({ start, end }, index) => {
          return (
            <li className="flex flex-row">
              <div className="select-none cursor-pointer flex flex-1 items-center p-4">
                <div className="flex-1 pl-1 mr-16">
                  <div className="font-medium dark:text-white text-red-500">
                    High CPU Alert
                  </div>
                  <div className="text-gray-600 dark:text-gray-200 text-sm">
                    CPU Load exceeded value of 1 for over 2 minutes
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-200 text-xs">
                  Start: {start?.toLocaleString()} - End:{" "}
                  {end?.toLocaleString() || "Ongoing"}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
