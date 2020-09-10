import models from '../../models'

export const get = async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
    } = req.query

    const limit = +pageSize || 10
    const offset = +page ? (+page - 1) * limit : 0

    const result = await models.Notice.findAndCountAll({
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
    if (!notice) throw new Error('해당 공지사항이 존재하지 않습니다ㅠㅠ')
    res.json(notice)
  } catch (err) {
    next(err)
  }
}