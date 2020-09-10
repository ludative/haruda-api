import crypto from 'crypto'
import config from '../../config'

// 1-1. 양방향 암호화 - 암호화
export const encrypt = value => {
  if (value) {
    const cipher = crypto.createCipher('aes256', config.privateKey)
    return cipher.update(value, 'ascii', 'hex') + cipher.final('hex')
  } else {
    return value
  }
}

// 1-2. 양방향 암호화 - 복호화
export const decrypt = value => {
  if (value) {
    const decipher = crypto.createDecipher('aes256', config.privateKey)
    return decipher.update(value, 'hex', 'ascii') + decipher.final('ascii')
  } else {
    return value
  }
}
