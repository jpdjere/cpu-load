import { useState } from 'react';
import './App.css';
import { useGetCPULoad, useAlerts, useD3TimeGraph } from './hooks';


function App() {
  const [mockHighLoad, setMockHighLoad] = useState(false);
  const { data, lastCPULoadValue } = useGetCPULoad(mockHighLoad);
  const { isAlert, consecutiveHighs, consecutiveLows } = useAlerts(lastCPULoadValue);
  useD3TimeGraph(data);

  console.log({
    data,
    lastCPULoadValue,
    isAlert,
  })


  return (
    <div className="App">
      <button onClick={() => setMockHighLoad(mock => !mock)}>Mock High Load</button>
      <p>Highs: {consecutiveHighs}</p>
      <p>Lows: {consecutiveLows}</p>
      <p>Alert?: {isAlert ? "High load" : "Normal CPU Load"}</p>
    </div>
  );
}



export default App;
