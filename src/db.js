import bcrypt from 'bcrypt-nodejs'
import models from './models'
import config from '../config'

export default async () => {
  try {
    await models.sequelize.sync({
      force: config.db.forceSync,
      alter: config.db.alter
    })

    if (config.db.forceSync) {
      await initialize()
    }
    console.log('db synced!')
  } catch (err) {
    console.error(err)
  }
}

const initialize = async function () {
  /**
   * 사용자 생성
   */
  try {
    // Users
    await Promise.all(modelsToInit.users.map(user => models.User.create(user)))
  } catch (err) {
    throw err
  }
}

const hash = bcrypt.hashSync('1111')

const modelsToInit = {
  users: [
    {
      id: 1,
      name: 'admin',
      password: hash,
      email: 'kkangil94@naver.com',
      isAdmin: true
    }
  ]
}
