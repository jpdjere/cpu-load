import { useState } from 'react';
import './App.css';
import { useGetCPULoad, useAlerts, useD3TimeGraph } from './hooks';


function App() {
  const [mockHighLoad, setMockHighLoad] = useState(false);
  const { data, lastCPULoadValue } = useGetCPULoad(mockHighLoad);
  const { isAlert, alertsAmount, recoveryAmount } = useAlerts(lastCPULoadValue);
  useD3TimeGraph(data);


  return (
    <div className="App">
      <div>
        <p>Current avg. CPU Load: {lastCPULoadValue.toFixed(3)}</p>
        <p>{isAlert ? "Alert: High CPU load" : "Normal CPU Load"}</p>
      </div>
      <div>
        <p>Periods under high CPU load: {alertsAmount}</p>
        <p>Recoveries from high CPU load: {recoveryAmount}</p>
        <button onClick={() => setMockHighLoad(mock => !mock)}>Mock High Load</button>
      </div>
    </div>
  );
}



export default App;
