import React from "react";
import { Line } from "react-chartjs-2";

export const Chart = props => <Line data={props.data} options={props.options} />