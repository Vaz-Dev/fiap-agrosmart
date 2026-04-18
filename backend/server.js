import express from "express"
import fs from "fs"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static(import.meta.dirname))

app.post("/csv", (req, res) => {
  const { predictionText, predictionPercentage } = req.body
  fs.appendFileSync("backend/dados.csv", `${predictionText},${predictionPercentage}\n`)

  res.json({ ok: true })
})

app.listen(3000, () => {
  console.log("rodando na porta 3000")
})

