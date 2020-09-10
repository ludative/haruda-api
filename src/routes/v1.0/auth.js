import passport from 'passport'
import bcrypt from 'bcrypt-nodejs'

import models from '../../models/index'
import { createToken, validateToken } from '../../lib/jwt'
import generateRandomString from '../../lib/generateRandomString'
import mailer from '../../lib/mailer'

export const authenticateToken = async (req, res, next) => {
  const token = req.get('x-access-token')
  const validatedUser = await validateToken({ token })

  if (validatedUser) res.json(validatedUser)
  else res.sendStatus(402)
}

export const signup = async (req, res, next) => {
  try {
    let {
      email,
      name,
      password,
      profileImage
    } = req.body

    email = email.replace(/' '/g, '')
    if (!email) throw new Error('이메일을 입력해주세요.')
    if (!name) throw new Error('이름을 입력해주세요.')
    if (!password) throw new Error('비밀번호를 입력해주세요.')

    await models.User.create({
      email,
      name,
      password: bcrypt.hashSync(password),
      isAdmin: false,
      profileImage
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const login = (req, res, next) => {
  passport.authenticate('local', function authenticateByLocal(err, user, ex) {
    if (err) {
      next(new Error('이메일과 비밀번호를 확인해주세요.'))
    } else {
      if (ex) {
        next(ex)
      } else {
        const token = createToken(user)
        user.token = token
        res.json(user)
      }
    }
  })(req, res)
}

export const duplEmail = async (req, res, next) => {
  try {
    const {
      email
    } = req.body

    const duplEmail = await models.User.findOne({
      where: {
        email
      }
    })

    res.json({
      isDuplEmail: !!duplEmail
    })
  } catch (err) {
    next(err)
  }
}

export const findPassword = async (req, res, next) => {
  try {
    const {
      email,
      name
    } = req.body

    const user = await models.User.findOne({
      where: {
        email,
        name
      }
    })

    if (!user) throw new Error('존재하지 않는 회원입니다.')

    const newPassword = generateRandomString(8)


    await user.update({
      password: bcrypt.hashSync(newPassword)
    })

    await mailer({
      to: user.email,
      subject: '[하루다] 임시 비밀번호',
      content: `<div>로그인 후 보안을 위해 비밀번호를 변경해주세요. 항상 저희 하루다를 이용해 주셔서 감사합니다.</div><div>임시 비밀번호: ${newPassword}</div>`
    })

    res.sendStatus(200)
  } catch (err) {
    // next(err)
    res.json(err)
  }
}
