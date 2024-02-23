const personsRouter = require('express').Router()
const Person = require('../models/person')

//GET api/persons
personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}) //unkownEndpoint

//GET api/persons/:id
personsRouter.get('/:id', (request, response, next) => {
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
personsRouter.post('/', (request, response, next) => {
  const body = request.body

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

//PUT update, if name exists > change number
personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findOneAndUpdate(
    { _id: request.params.id },
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//DELETE by id
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end() //204 NOCONTENT
    })
    .catch(error => next(error))
})

module.exports = personsRouter
