const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")

app.use(express.json())
app.use(express.static("dist"))
app.use(cors())
app.use(morgan("oma"))

//GET /
app.get("/", (request, response) => {
  response.send("<h1>Tervetuloa Puhelinluetteloon</h1>")
})

//GET /info
app.get("/info", (request, response) => {
  const text = `<p>Hard coded Phonebook has info for ${
    persons.length
  } people</p>\n<p>${new Date()} </p>`
  response.send(text)
})

//GET api/persons
app.get("/api/persons", (request, response) => {
  response.json(persons)
})

//GET api/persons/:id
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  person ? response.json(person) : response.status(404).end()
})

//POST create a person
const generateId = () => Math.floor(Math.random() * 100)
app.post("/api/persons", (request, response) => {
  const body = request.body
  const nameExists = persons.find(person => person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing",
    })
  } else if (nameExists) {
    return response.status(400).json({
      error: "Name already exists on phonebook",
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number missing",
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

//DELETE by id
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//unknownEndpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

//PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

//Persons
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
