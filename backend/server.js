import express from "express"
import fs from "fs"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static(import.meta.dirname))

app.post("/dados", (req, res) => {
  const dado = req.body
  
  if (fs.existsSync("backend/dados.json")) {
    const conteudo = fs.readFileSync("backend/dados.json", "utf8")
    if (conteudo == "") {
      var array = []
      array.push(dado)
      fs.writeFileSync("backend/dados.json", JSON.stringify(array))
    }
    else {
      var conteudoTratado = JSON.parse(conteudo)
      conteudoTratado.push(dado)
      fs.writeFileSync("backend/dados.json", JSON.stringify(conteudoTratado))
    }
  }
  res.json({ ok: true })
})

app.get("/dados", (req, res) => {
  try {
    const content = fs.readFileSync("backend/dados.json", "utf-8")
    const conteudoTratado = JSON.parse(content)
    res.send(conteudoTratado)
    
  } catch (err) {
    console.log(err)
  }
})

app.listen(3000, () => {
  console.log("rodando na porta 3000")
})

