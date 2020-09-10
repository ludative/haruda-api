import bcrypt from 'bcrypt-nodejs'
import models from '../../../models'

export const get = async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
      isAdmin
    } = req.query

    const limit = +pageSize || 20
    const offset = ((+page || 1) - 1) * (pageSize || 20)

    const result = await models.User.findAndCountAll({
      where: {
        isAdmin: JSON.parse(isAdmin)
      },
      attributes: {
        exclude: ['password']
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const createAdmin = async (req, res, next) => {
  try {
    let {
      email,
      name,
      password
    } = req.body

    email = email.replace(/' '/g, '')
    if (!email) throw new Error('이메일을 입력해주세요.')
    if (!name) throw new Error('이름을 입력해주세요.')
    if (!password) throw new Error('비밀번호를 입력해주세요.')

    const [user, created] = await models.User.findOrCreate({
      where: { email },
      defaults: {
        email,
        name,
        password: bcrypt.hashSync(password),
        isAdmin: true,
        profileImage: ''
      }
    })

    if (!created) throw new Error('중복된 이메일이 존재합니다.')

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}