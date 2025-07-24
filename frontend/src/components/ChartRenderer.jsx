import React from "react";
import {
    Bar,
    Line,
    pie,
}from "react-chartjs-2";

import {
    Chart as Chartjs,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElemnt,
    Tooltip,
    Legend,
    plugins,
} from "chart.js";

Chartjs.register(
      BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElemnt,
    Tooltip,
    Legend,

);

const ChartRenderer =({chartType ,data , options})=>{

    const chartProps={
        data:chartData,
        options :{
            responsive:true,
            plugins:{
                legend:{position:"top"},
                title: {display:true,text:"Excel Chart"},

            },
        },


    };
    if(chartType==="bar") return <Bar {...chartProps}/>;
    if(chartType==="line") return <line {...chartProps}/>;
    if(chartProps==="pie") return<pie {...chartProps}/>;
    return<p>Unsupported chart type</p>

};

exports default ChartRenderer;
