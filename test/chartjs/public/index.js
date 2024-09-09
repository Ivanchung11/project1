import Chart from 'chart.js/auto';

// const fs = require('fs');
// import { eleProfile } from "/elevationprofile.js"
window.onload = () => {
  plotElevationProfile();
};

async function plotElevationProfile() {
  let res = await fetch("http://localhost:8080/elevation");

  let response = await res.json();

  let scatterPoints = response.data;

  console.log(scatterPoints);

  const data = {
    datasets: [
      {
        label: "路徑高度圖",
        data: scatterPoints,
        showLine: true,
        // tension: 0.4,
      },
    ],
  };

  const config = {
    type: "scatter",
    data: data,
    options: {
      plugins: {
        // title: {
        //   display: true,
        //   text: '路徑高度圖',
        //   color: "#000",
        //   font: {
        //     size: 36,
        //   }
        // },
        legend: {
          display: false,
        },
      },
      elements: {
        point: { pointStyle: false },
        line: {
          tension: 0.4,
          borderColor: "rgba(0, 153, 0,0.6)",
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            text: "距離(米)",
            display: true,
          },
        },
        y: {
          type: "linear",
          grace: "10%",
          title: { text: "高度(米)", display: true },
        },
      },
    },
  };

  var myChart = new Chart(document.getElementById("myChart"), config);
}

// (async function() {
//     const data = [
//       { year: 2010, count: 10 },
//       { year: 2011, count: 20 },
//       { year: 2012, count: 15 },
//       { year: 2013, count: 25 },
//       { year: 2014, count: 22 },
//       { year: 2015, count: 30 },
//       { year: 2016, count: 28 },
//     ];

//     new Chart(
//       document.getElementById('myChart'),
//       {
//         type: 'bar',
//         data: {
//           labels: data.map(row => row.year),
//           datasets: [
//             {
//               label: 'Acquisitions by year',
//               data: data.map(row => row.count)
//             }
//           ]
//         }
//       }
//     );
//   })();
