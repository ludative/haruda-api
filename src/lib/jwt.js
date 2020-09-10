import jwt from 'jsonwebtoken'
import config from '../../config'

export const createToken = (payload = {}) => {
  return jwt.sign(payload, config.privateKey, { algorithm: 'HS256' })
}

export const validateToken = (options = {}) => {
  let {
    token
  } = options

  return new Promise((resolve, reject) => {
    jwt.verify(token, config.privateKey, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  })
}
