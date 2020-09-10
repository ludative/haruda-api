import models from '../../models'

export const getMyQnas = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const {
      page,
      pageSize
    } = req.query

    const limit = +pageSize || 10
    const offset = ((+page || 1) - 1) * (pageSize || 10)

    const qnas = await models.Qna.findAndCountAll({
      where: {
        UserId
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    res.json(qnas)
  } catch (err) {
    next(err)
  }
}

export const createQna = async (req, res, next) => {
  try {
    const {
      title,
      question
    } = req.body

    if (!title) throw new Error('제목을 입력해주세요!')
    if (!question) throw new Error('내용을 입력해주세요!')

    await models.Qna.create({
      ...req.body,
      UserId: req.user.id
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}


export const updateQnaById = async (req, res, next) => {
  try {
    const {
      title,
      question
    } = req.body

    if (!title) throw new Error('제목을 입력해주세요!')
    if (!question) throw new Error('내용을 입력해주세요!')

    const qna = await models.Qna.findByPk(req.params.id)

    if (qna.UserId !== req.user.id) {
      throw new Error('내가 등록한 질문만 수정가능합니다ㅠ')
    }

    await qna.update(req.body)

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteQnaById = async (req, res, next) => {
  try {
    const qna = await models.Qna.findByPk(req.params.id)

    if (qna.UserId !== req.user.id) {
      throw new Error('내가 등록한 질문만 삭제가능합니다ㅠ')
    }

    await qna.destroy()

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}