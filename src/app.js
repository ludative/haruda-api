import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import flash from 'connect-flash'
import CORS from 'cors'

import db from './db'
import passport from './passport'
import routes from './routes'

import config from '../config'

db()
passport()


const app = express()
app.use(
  logger('dev', {
    skip: () => app.get('env') === 'test'
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(flash())
app.use(
  CORS({
    exposedHeaders: ['x-access-token']
  })
)

// Routes
app.use('/api', routes)

// Catch 404 and forward to error handler
app.use((req, res) => {
  throw new Error('Not Found')
})

// Error handler
app.use(function onError(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  /**
   * if you use only for API Server
   */
  const error = {
    project: config.project,
    version: config.version,
    host: req.headers.host,
    'user-agent': req.headers['user-agent'],
    url: req.url,
    status: err.status || 500,
    method: req.method,
    message: err.message || err.text || 'There was an error on API server',
    userId: req.validUser ? req.validUser.id : null,
    env: process.env.NODE_ENV
  }

  res.status(err.status || 500).json(error)
})

const port = process.env.PORT || config.port
app.listen(port, () => console.log(`Listening on port ${port}`))