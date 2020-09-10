import models from '../../models'

export const getComments = async (req, res, next) => {
  try {
    const {
      DiaryContentId,
      page,
      pageSize
    } = req.query

    if (!DiaryContentId) throw new Error('다이어리 글 ID가 필요합니다.')

    const limit = +pageSize || 10
    const offset = +page ? (+page - 1) * limit : 0

    const result = await models.DiaryContentComment.findAndCountAll({
      where: {
        DiaryContentId
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name', 'profileImage']
      }]
    })

    res.json(result)

  } catch (err) {
    next(err)
  }
}

export const createComment = async (req, res, next) => {
  try {
    const {
      comment,
      DiaryContentId
    } = req.body

    const diaryContent = await models.DiaryContent.findByPk(DiaryContentId)
    if (!diaryContent) throw new Error('존재하지 않는 글입니다ㅠㅠ')

    const validUserDiary = await models.UserDiary.findOne({
      where: {
        DiaryId: diaryContent.DiaryId,
        UserId: req.user.id
      }
    })
    if (!validUserDiary) throw new Error('해당 다이어리에 권한이 없습니다ㅠㅠ')

    if (!comment) throw new Error('댓글을 입력해주세요!')

    await models.DiaryContentComment.create({
      comment,
      DiaryContentId,
      UserId: req.user.id
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const updateCommentById = async (req, res, next) => {
  try {
    const {
      comment
    } = req.body

    if (!comment) throw new Error('댓글을 입력해주세요!')

    const diaryContentComment = await models.DiaryContentComment.findByPk(req.params.id)

    if (diaryContentComment.UserId !== req.user.id) {
      throw new Error('내가 등록한 댓글만 수정할 수 있어요.')
    }

    await diaryContentComment.update({
      comment
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteCommentById = async (req, res, next) => {
  try {
    const diaryContentComment = await models.DiaryContentComment.findByPk(req.params.id)

    if (diaryContentComment.UserId !== req.user.id) {
      throw new Error('내가 등록한 댓글만 삭제할 수 있어요.')
    }

    await diaryContentComment.destroy()

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}