import "./styles/App.css";
import React, { useState } from "react";
import { Navbar } from "./components";
import { Chart } from "./components/Chart";
import ws from './helpers/websocket'

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        label: "BTC-USD",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "#ededed",
        pointRadius: 0,
        borderWidth: "2",
        lineTension: 0.45,
        data: [],
      },
    ],
  });

  const [chartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    legend: {
      display: true,
      labels: {
        fontColor: "#ededed",
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            fontColor: "#ededed",
          },
          scaleLabel: {
            display: true,
            labelString: "Local Time",
            fontSize: 16,
            fontColor: "#ededed",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            callback: function (value, index, values) {
              return "$" + value;
            },
            fontColor: "#ededed",
          },
          scaleLabel: {
            display: true,
            labelString: "USD",
            fontSize: 16,
            fontColor: "#ededed",
          },
        },
      ],
    },
  });

  useState(() => {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: [
            "BTC-USD",
            "BTC-EUR",
            "BTC-GBP",
          ],
        },
      ],
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {
      const value = JSON.parse(e.data);
      if (value.product_id === "BTC-USD") {
      
      console.log(value);
        const oldBtcDataSet = chartData.datasets[0];
        const newBtcDataSet = { ...oldBtcDataSet, data: oldBtcDataSet.data.concat(value.price) };

        const oldLabel = chartData;
        const newLabel = { ...oldLabel };
        newLabel.labels.push(new Date().toLocaleTimeString());
        
        const newChartData = {
          ...chartData,
          datasets: [newBtcDataSet],
          labels: newLabel.labels,
        };
        setChartData(newChartData);
      }
    };

    return () => {
      ws.close();
    };
  }, []);
  
  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#141f31" }}>
        <div className="container">
          <div className="app">
            <div className="chart-container" style={{ height: 400 }}>
              <Chart
                data={chartData}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
