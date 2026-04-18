import './public/style.css'
import { Chart } from "chart.js/auto"

const chart = document.getElementById("chart")

const reqGet = async () => {
  const response = await fetch("/dados")
  for (var n in response) {
    console.log(n)
  }
} 

window.onload = async () => {
  reqGet()
}


// new Chart(chart, {
//   type: "bar",
//   data: {

//   }
// })