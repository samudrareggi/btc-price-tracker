import "./styles/App.css";
import React, { useState } from "react";
import { Navbar } from "./components";
import { Chart } from "./components/Chart";
import ws from './helpers/websocket'

function App() {
  const [payload, setPayload] = useState({
    value: '',
    select: 'USD'
  })
  const [options, setOptions] = useState(['USD', 'EUR', 'GBP'])
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
  
  const onChange = (e, name) => {
    const value = {
      ...payload,
      [name]: e.target.value
    }
    setPayload(value)
    console.log(value);
  }
  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#141f31" }}>
        <div className="container">
          <div className="app">
            <div className="d-flex justify-content-center">

            <div className="input-group mb-5 mt-5" style={{width: '50%'}}>
            <span className="input-group-text"><i className="fab fa-bitcoin"></i></span>
              <input type="number" className="form-control" min='0' onChange={(e) => onChange(e, 'value')} defaultValue={payload.value} placeholder="Input your bitcoin"/>
              <select className="btn btn-outline-secondary" style={{color: '#ededed'}} onChange={(e) => onChange(e, 'select')} defaultValue={options[0]} id="inputGroupSelect01">
                {
                  options.map((el, i) => <option key={i} value={el}>{el}</option>)
                }
              </select>
            </div>
            </div>

            <div className="chart-container" style={{height: 400}}>
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
