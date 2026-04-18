import './public/style.css'
import { Chart } from "chart.js/auto"

const positiveNegative = document.getElementById("positive-negative-chart")
const textResult = document.getElementById("text-result-chart")

const getData = async () => {
  const response = await fetch("/dados")
  const data = await response.json()
  return data
}

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const generalResultChart = (saudavel, doente, inconclusivo) => {
  var total = saudavel + doente + inconclusivo
  new Chart(positiveNegative, {
  type: "bar",
  data: {
    labels: ["Saudável", "Doente", "Inconclusivo"],
    datasets: [{
      label: `${Math.round((saudavel/total) * 100)}% de plantas saudáveis`,
      data: [saudavel, doente, inconclusivo],
    }]
  },
  options: {
    plugins: {
      customCanvasBackgroundColor: {
        color: 'white',
      }
    },
    layout: {
              padding: 30
          }
  },
  plugins: [plugin],
})
}

const textResultChart = (data) => {
  var rotulos = data.map((e) => e.text)
  var rotulos2 = rotulos.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc
  }, {})
  console.log(rotulos2)
  var labs = Object.keys(rotulos2)
  var newData = Object.values(rotulos2)
  new Chart(textResult, {
    type: "bar",
    data: {
      labels: labs,
      datasets: [{
        data: newData,
        barThickness: 50
      }]
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: 'white',
        }
      },
      layout: {
              padding: 30
          }
    },
    plugins: [plugin],
  })
}

const loadCharts = (data) => {
  console.log(data)
  var doente = 0, saudavel = 0, inconclusivo = 0
  data.forEach((e) => {
    if (e.percentage < 50) {
      saudavel++
    }
    else if (e.percentage > 50) {
      doente++
    }
    else {
      inconclusivo++
    }
  })
  //var saudavel = data.filter((e) => e.percentage < 50)
  //var doente = data.filter((e) => e.percentage > 50)
  generalResultChart(saudavel, doente, inconclusivo)
  textResultChart(data)

}

window.onload = async () => {
  const data = await getData()
  loadCharts(data)
}


