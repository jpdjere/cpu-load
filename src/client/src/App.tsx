import { useState } from "react";
import "./App.css";
import { Card } from "./components/Card";
import { LineGraph } from "./components/Graph";
import { Title } from "./components/Title";
import { AlertList } from "./components/AlertList";
import { useGetCPULoad, useAlerts } from "./hooks";

function App() {
  const [mockHighLoad, setMockHighLoad] = useState(false);
  const { data, lastCPULoadValue } = useGetCPULoad(mockHighLoad);
  const { isAlert, alertsAmount, recoveryAmount, alertPhases } =
    useAlerts(lastCPULoadValue);

  return (
    <div className="md:container md:mx-auto">
      <Title mockHighLoad={mockHighLoad} setMockHighLoad={setMockHighLoad} />
      <LineGraph data={data} />
      <div className="flex flex-col md:flex-row">
        <div>
          <Card
            title="Current CPU Load"
            description="Average of CPU Load in the last 10 seconds"
            value={lastCPULoadValue.toFixed(3).toString()}
          />
          <Card
            title="Current status"
            description="A CPU is considered under high load when it has exceeded a value of 1 for over 2 minutes."
            value={isAlert ? "Alert: High CPU load" : "Normal CPU Load"}
            color={isAlert ? "alert" : "success"}
          />
        </div>
        <div>
          <Card
            title="Periods under high CPU load"
            description="Amount of times the CPU Load alert was triggered"
            value={alertsAmount}
          />
          <Card
            title="Recoveries from high CPU load"
            description="Amount of recoveries from high CPU load alerts"
            value={recoveryAmount}
          />
        </div>
        <AlertList alertPhases={alertPhases} />
      </div>
    </div>
  );
}

export default App;
