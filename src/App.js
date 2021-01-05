import "./styles/App.css";
import React, { useState } from "react";
import { Navbar, Card } from "./components";
import { Chart } from "./components/Chart";
import { debounce } from "lodash";
import ws from "./helpers/websocket";

function App() {
  const [payload, setPayload] = useState({
    value: "",
    rate: [0,0,0]
  });
  const [usd, setUsd] = useState(0);
  const [eur, setEur] = useState(0);
  const [gbp, setGbp] = useState(0);

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
          product_ids: ["BTC-EUR", "BTC-GBP", "BTC-USD"],
        },
      ],
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {
      const value = JSON.parse(e.data);
      if (value.product_id === "BTC-EUR") {
        setEur(value.price);
      } else if (value.product_id === "BTC-USD") {
        setUsd(value.price);
      } else {
        setGbp(value.price);
      }

      if (value.product_id === "BTC-USD") {
        const oldBtcDataSet = chartData.datasets[0];
        const newBtcDataSet = {
          ...oldBtcDataSet,
          data: oldBtcDataSet.data.concat(value.price),
        };

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

  const onChange = debounce((e) => {
    const value = e.target.value;
    const valUsd = value * usd
    const valEur = value * eur
    const valGbp = value * gbp
    const result = {...payload, value: value, rate: [valUsd, valEur, valGbp]}

    setPayload(result)
    console.log(value);
  }, 500);
  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#141f31" }}>
        <div className="container">
          <div className="app">
            <div className="d-flex justify-content-center">
              <label className="input-group mb-5 mt-5" style={{ width: "40%" }}>
                <span className="input-group-text">
                  <i className="fab fa-bitcoin"></i>
                </span>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  onChange={(e) => onChange(e, "value")}
                  defaultValue={payload.value}
                  placeholder="Input your bitcoin"
                />
              </label>
            </div>
            <div className="row">
              {
                payload.value ? <Card payload={payload}/> : null
              }
            </div>

            <div className="chart-container" style={{ height: 400 }}>
              <Chart data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
