require("dotenv").config()
const express = require("express")
const app = express()
const Person = require("./models/person")
const cors = require("cors")
const morgan = require("morgan")

app.use(cors())
app.use(express.json())
app.use(morgan("oma"))
app.use(express.static("dist"))

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
}) //unkownEndpoint

//GET api/persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}) //unkownEndpoint

//GET api/persons/:id
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end() //kun mennään jo poistettuun id:hen / id:hen, jota ei ole
      }
    })
    .catch(error => next(error)) //"malformatted id" Id väärässä muodossa -> liian lyhyt / pitkä
})

//POST create a person
app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name) {
    //(body.name === undefined) { //tämä tallensi ilman nimeä
    return response.status(400).json({ error: "name missing" })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//PUT => update, jos annettu nimi jo olemassa > numeron muutos
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findOneAndUpdate({ _id: request.params.id, name: body.name }, person, {
    new: true,
  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//DELETE by id
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end() //204 NoContent
    })
    .catch(error => next(error))
})

//unknownEndpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }
  //Jos tarve käsitellä joitakin erityisiä virheitä eri tavalla, lisää niiden käsittely tänne
  // } else if (error.name === "MongoNetworkError") {
  //   return response
  //     .status(500)
  //     .json({ error: "Database error: Connection failed" })
  // } // tietokantayhteyden aiheuttama virhe

  next(error)
}
app.use(errorHandler)

//PORT
const PORT = process.env.PORT // || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

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

//3.12 tietokanta komentoriviltä, luo MongoDB, mongo.js
//3.13 backend hakee näytettävät puhelintiedot tietokannasta
//      Mongoose-spesifinen koodi omaan moduuliinsa
//3.14 Muuta backendiä siten, että uudet numerot tallennetaan tietokantaan
//    voit olla välittämättä siitä, onko tietokannassa jo henkilöä, jolla on sama nimi kuin lisättävällä
//3.15 numerotietojen poistaminen tietokannasta
//3.16 virheiden käsittely middlewarella
//3.17 jos annettu nimi jo olemassa (ja window confirm) > numeron muutos
//3.18 päivitä polkujen api/persons/:id ja info käsittely


// const generateId = () => Math.floor(Math.random() * 100)
// app.post("/api/persons", (request, response) => {
//   const body = request.body
//   const nameExists = persons.find(person => person.name === body.name)
//   console.log(request.body)

//   if (!body.name) {
//     return response.status(400).json({
//       error: "Name missing",
//     })
//   } else if (nameExists) {
//     return response.status(400).json({
//       error: "Name already exists on phonebook",
//     })
//   } else if (!body.number) {
//     return response.status(400).json({
//       error: "Number missing",
//     })
//   }

//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }

//   persons = persons.concat(person)
//   response.json(person)
// })
