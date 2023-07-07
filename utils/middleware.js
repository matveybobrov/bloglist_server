const jwt = require('jsonwebtoken')

const logger = require('./logger')

const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    req.token = authorization.replace('Bearer ', '')
  } else req.token = null
  next()
}

// eslint-disable-next-line consistent-return
const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invlid token' })
  }

  const user = await User.findById(decodedToken.id)
  if (user === null) {
    return res
      .status(401)
      .json({ error: 'no such user in database with provided token' })
  }

  req.user = user
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).json({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).json({ error: error.message })
    case 'JsonWebTokenError':
      return res.status(400).json({ error: error.message })
    default:
      return next(error)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
