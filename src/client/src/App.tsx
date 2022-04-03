import { useState } from 'react';
import './App.css';
import { Title } from './components/Title';
import { useGetCPULoad, useAlerts, useD3TimeGraph } from './hooks';


function App() {
  const [mockHighLoad, setMockHighLoad] = useState(false);
  const { data, lastCPULoadValue } = useGetCPULoad(mockHighLoad);
  const { isAlert, alertsAmount, recoveryAmount, alertPhases } = useAlerts(lastCPULoadValue);
  useD3TimeGraph(data);


  return (
    <div className="App">
      <Title />
      
      {/* <div>
        <p>Current avg. CPU Load: {lastCPULoadValue.toFixed(3)}</p>
        <p>{isAlert ? "Alert: High CPU load" : "Normal CPU Load"}</p>
      </div>
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
