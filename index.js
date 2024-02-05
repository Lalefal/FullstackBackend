const express = require("express")
const app = express()
app.use(express.json())

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get("/", (request, response) => {
  response.send("<h1>Tervetuloa Puhelinluetteloon</h1>")
})

app.get("/info", (request, response) => {
  const amount = persons.length
  const text = `<p>Phonebook has info for ${amount} people</p>\n<p>testi322</p>`
  response.send(text)
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
]
