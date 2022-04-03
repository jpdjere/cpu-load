import { useState } from "react";
import "./App.css";
import { LineGraph } from "./components/Graph";
import { Title } from "./components/Title";
import { useGetCPULoad, useAlerts } from "./hooks";

function App() {
  const [mockHighLoad, setMockHighLoad] = useState(false);
  const { data, lastCPULoadValue } = useGetCPULoad(mockHighLoad);
  const { isAlert, alertsAmount, recoveryAmount, alertPhases } =
    useAlerts(lastCPULoadValue);
  // useD3TimeGraph(data);
  console.log({ data });

  return (
    <div className="md:container md:mx-auto">
      <Title />
      <LineGraph data={data} />
      <div className="flex flex-col md:flex-row">
        <div>
          <p>Current avg. CPU Load: {lastCPULoadValue.toFixed(3)}</p>
          <p>{isAlert ? "Alert: High CPU load" : "Normal CPU Load"}</p>
        </div>
      </div>

      {/* 
      <div>
        <p>Periods under high CPU load: {alertsAmount}</p>
        <p>Recoveries from high CPU load: {recoveryAmount}</p>
        <button onClick={() => setMockHighLoad(mock => !mock)}>Mock High Load</button>
      </div>
      <div>
        <p>Alert Phases</p>
        {alertPhases.map(({start, end}, index) => <p key={start.toISOString()}>Start: {start.toDateString()} - End: {end ? end.toDateString() : "ONGOING"}</p>)}
      </div> */}
    </div>
  );
}

export default App;
