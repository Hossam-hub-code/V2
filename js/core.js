//Global Variables
let heads = [];
let Categories1Sheet1 = [];
let Categories1Sheet2 = [];
let arr1sheet1 = [];
let arr2sheet1 = [];
let arr1sheet2 = [];
let sumTotalATM = 0;
let firstChart = document.getElementById("container1");
let secondChart = document.getElementById("container2");
let chartVisableCount = 60;
let contaniers = document.querySelectorAll('[id^="container"]');

//Animation Function

Math.easeOutBounce = (pos) => {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos;
  } else if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
  } else if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
  }
};

//Start Uploading files
document.getElementById("btn-submit").addEventListener("click", () => {
  let upload = document.getElementById("file");
  //Sheet 1 importing
  readXlsxFile(upload.files[0], { sheet: "installed VS removed" }).then(
    (data) => {
      heads.push(data[0]);
      data.forEach((r) => {
        if (r[0] != "Customer") {
          Categories1Sheet1.push(r[0]);
          arr1sheet1.push(r[2]);
          arr2sheet1.push(r[3]);
        }
      });
    }
  );
  //Sheet 2 importing
  readXlsxFile(upload.files[0], { sheet: "Installed base YTD" }).then(
    (data) => {
      data.forEach((r) => {
        if (r[0] != "Customer") {
          Categories1Sheet2.push(r[0]);
          sumTotalATM += r[1];
          arr1sheet2.push(r[1]);
        }
      });
    }
  );
  //End Uploading files
  upload.value = "";
});

//Start Button

document.getElementById("btn-start").addEventListener("click", AllChart);

function AllChart() {
  //Animation list
  document.getElementById("controller").style.zIndex = -10;
  document.getElementById("controller").style.opacity = 0;
  document.querySelector(".background").style.zIndex = -10;
  document.querySelector(".background").style.opacity = 0;
  document.querySelector("#counter").style.zIndex = -10;
  document.querySelector("#counter").style.opacity = 0;
  document.querySelector("#presentation").style.animation =
    "fading-In 0.5s linear 0.5s forwards , fading-Out 0.5s linear 10s forwards ";
  document.querySelector("#presentation h1").style.animation =
    "comeRight 3s linear";
  document.querySelector("#presentation img").style.animation =
    "comeDown 1s 3.5s linear forwards";
  let perValue = document.querySelector("#preValue").value;
  chartVisableCount = perValue * 60 + 10;
  console.log(chartVisableCount);

  animation();

  function animation() {
    contaniers.forEach((r, index) => {
      let containCount = r.getAttribute("index");
      if (index == 0) {
        r.style.animation = `fading-In 0.5s linear ${11}.5s backwards , fading-Out 0.5s linear ${
          chartVisableCount * containCount
        }.5s forwards`;
      } else {
        r.style.animation = `fading-In 0.5s linear ${
          chartVisableCount * index + 1
        }.5s backwards , fading-Out 0.5s linear ${
          chartVisableCount * containCount
        }.5s forwards`;
      }
    });
  }

  let chart = Highcharts.chart("container1", {
    chart: {
      alignThresholds: true,
      type: "column",
      zoomType: "x",
      panning: true,
      panKey: "shift",
    },

    credits: false,

    title: {
      text: "Installation/ Turnover YTD",
    },
    xAxis: {
      categories: Categories1Sheet1,
      labels: {
        format: "<b>{text}</b>",
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    yAxis: [
      {
        title: {
          text: heads[0][2],
        },
        plotLines: [
          {
            value: 0,
            width: 0,
            zIndex: 1,
          },
        ],
        gridLineWidth: 0,
      },
      {
        title: {
          text: heads[0][3],
        },
        opposite: true,
      },
    ],
    series: [
      {
        name: heads[0][2],
        data: arr1sheet1,
        yAxis: 0,
        animation: {
          defer: 10 * 1500,
          duration: 1500,
        },
        color: "#00c9a7",
      },
      {
        name: heads[0][3],
        data: arr2sheet1,
        yAxis: 1,
        animation: {
          defer: 10 * 1500,
          duration: 1500,
          // Uses Math.easeOutBounce
          easing: "easeOutBounce",
        },

        color: "#ff3e41",
      },
    ],
  });
  let chart2 = Highcharts.chart("container2", {
    title: {
      text: "Installed base YTD",
      align: "center",
    },

    credits: false,

    xAxis: {
      categories: Categories1Sheet2,
    },
    yAxis: {
      title: {
        text: "ATMs",
      },
    },
    tooltip: {
      valueSuffix: " ATM",
    },
    series: [
      {
        type: "column",
        name: heads[0][1],
        color: "#8085e9",
        data: arr1sheet2,
        dataLabels: {
          enabled: true,
        },
        animation: {
          defer: chartVisableCount * 1000 + 1500,
          duration: 1500,
        },
      },
      {
        type: "pie",
        name: "Total",
        data: [
          {
            name: "Total ATM",
            y: sumTotalATM,
            color: "#f7a35c", // 2020 color
            dataLabels: {
              color: "black",
              enabled: true,
              distance: -85,
              format: "{point.total}",
              style: {
                fontSize: "25px",
              },
            },
          },
        ],
        animation: {
          defer: chartVisableCount * 1000 + 1500,
          duration: 1500,
        },
        center: [550, 100],
        size: 150,
        innerSize: "70%",
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  });
}
//End Charts
