import bcrypt from 'bcrypt-nodejs'
import passport from 'passport'
import passportLocal from 'passport-local'

import models from './models'

const LocalStrategy = passportLocal.Strategy

export default () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const user = await models.User.findOne({
        where: {
          email: username
        },
        attributes: ['id', 'email', 'name', 'password', 'isAdmin', 'profileImage']
      })

      if (user) {
        const valid = bcrypt.compareSync(password, user.password)
        if (!valid) {
          return done(null, false, { message: '비밀번호가 일치하지 않습니다..' })
        }

        const { id, email, name, isAdmin, profileImage } = user

        return done(null, {
          id, email, name, isAdmin, profileImage
        })
      } else {
        return done(null, false, { message: '이메일을 확인해주세요.' })
      }
    } catch (err) {
      done(err)
    }
  }
  ))
}
