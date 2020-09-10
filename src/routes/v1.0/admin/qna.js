import models from '../../../models'
import { Op } from 'sequelize'

export const getQnas = async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
      title,
      isWaitingAnswer
    } = req.query

    const limit = +pageSize || 20
    const offset = ((+page || 1) - 1) * (pageSize || 20)

    const where = {}

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`
      }
    }

    if (isWaitingAnswer) {
      where.answer = {
        [Op.ne]: null
      }
    }

    const qnas = await models.Qna.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'email']
      }]
    })

    res.json(qnas)
  } catch (err) {
    next(err)
  }
}

export const getQnaById = async (req, res, next) => {
  try {
    const qna = await models.Qna.findByPk(req.params.id, {
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'email']
      }]
    })

    if (!qna) throw new Error('존재하지 않는 QnA 입니다.')

    res.json(qna)
  } catch (err) {
    next(err)
  }
}

export const createAnswer = async (req, res, next) => {
  try {
    const {
      id,
      answer
    } = req.body

    if (!answer) throw new Error('답변을 입력해주세요.')

    const qna = await models.Qna.findByPk(id)
    if (!qna) throw new Error('해당 질문이 존재하지 않습니다.')

    await qna.update({
      answer
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}