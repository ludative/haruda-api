import models from '../../../models'
import { Op } from 'sequelize'

export const get = async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
      title
    } = req.query

    const limit = +pageSize || 20
    const offset = +page ? (+page - 1) * limit : 0
    const where = {}
    if (title) {
      where.title = {
        [Op.like]: `%${title}%`
      }
    }

    const result = await models.Notice.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'createdAt']
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const notice = await models.Notice.findByPk(req.params.id)
    if (!notice) throw new Error('해당 공지사항이 존재하지 않습니다.')
    res.json(notice)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const {
      title,
      content
    } = req.body

    if (!title) throw new Error('공지사항 제목을 입력해주세요.')
    if (!content) throw new Error('공지사항 내용을 입력해주세요.')

    await models.Notice.create(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const updateById = async (req, res, next) => {
  try {
    const {
      title,
      content
    } = req.body

    if (!title) throw new Error('공지사항 제목을 입력해주세요.')
    if (!content) throw new Error('공지사항 내용을 입력해주세요.')

    const notice = await models.Notice.findByPk(req.params.id)
    if (!notice) throw new Error('해당 공지사항이 존재하지 않습니다.')

    await notice.update(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteById = async (req, res, next) => {
  try {
    const notice = await models.Notice.findByPk(req.params.id)
    if (!notice) throw new Error('해당 공지사항이 존재하지 않습니다.')

    await notice.destroy()
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}