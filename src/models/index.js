import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import dotenv from 'dotenv'
import config from '../../config'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: config.db.dialect,
    host: process.env.DB_HOST,
    timezone: config.db.timezone
  }
)

let db = {}
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js'
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.User.hasMany(db.Diary)
db.User.hasMany(db.UserDiary)
db.User.hasMany(db.DiaryContent)
db.User.hasMany(db.DiaryContentComment)
db.User.hasMany(db.DiarySchedule)
db.User.hasMany(db.DiaryTodoList)
db.User.hasMany(db.Qna)

db.Diary.belongsTo(db.User)
db.Diary.hasMany(db.UserDiary)
db.Diary.hasMany(db.DiaryContent)
db.Diary.hasMany(db.DiarySchedule)
db.Diary.hasMany(db.DiaryTodoList)

db.UserDiary.belongsTo(db.User)
db.UserDiary.belongsTo(db.Diary)

db.DiaryContent.belongsTo(db.User)
db.DiaryContent.belongsTo(db.Diary)
db.DiaryContent.hasMany(db.DiaryContentImage)
db.DiaryContent.hasMany(db.DiaryContentComment)

db.DiaryContentImage.belongsTo(db.DiaryContent)

db.DiaryContentComment.belongsTo(db.User)
db.DiaryContentComment.belongsTo(db.DiaryContent)

db.DiarySchedule.belongsTo(db.Diary)
db.DiarySchedule.belongsTo(db.User)

db.DiaryTodoList.belongsTo(db.User)
db.DiaryTodoList.belongsTo(db.Diary)

db.Qna.belongsTo(db.User)

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
