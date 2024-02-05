const express = require("express")
const app = express()
app.use(express.json())

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const generateId = () => Math.floor(Math.random() * 100)

app.post("/api/persons", (request, response) => {
    const body = request.body
    const nameExits = persons.find(person => person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing"
    })
  } else if (nameExits) {
      return response.status(400).json({
      error: "Name already exists on phonebook"
      })
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number missing"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get("/", (request, response) => {
  response.send("<h1>Tervetuloa Puhelinluetteloon</h1>")
})

app.get("/info", (request, response) => {
  //   const amount = persons.length
  //   const date = new Date()
  const text = `<p>Phonebook has info for ${
    persons.length
  } people</p>\n<p>${new Date()} </p>`
  response.send(text)
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  person ? response.json(person) : response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
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
