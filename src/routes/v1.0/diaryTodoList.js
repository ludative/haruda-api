import models from '../../models'

export const getTodoLists = async (req, res, next) => {
  try {
    const {
      DiaryId
    } = req.query

    if (!DiaryId) throw new Error('다이어리 ID가 없습니다!')

    const todoLists = await models.DiaryTodoList.findAll({
      where: {
        DiaryId
      },
      order: [['createdAt', 'DESC']],
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'email', 'profileImage']
      }]
    })

    res.json(todoLists)
  } catch (err) {
    next(err)
  }
}

export const createTodoList = async (req, res, next) => {
  try {
    const {
      DiaryId,
      title
    } = req.body
    const UserId = req.user.id

    if (!title) throw new Error('제목을 입력해주세요!')
    if (!DiaryId) throw new Error('다이어리 ID가 없습니다!')

    const diary = await models.Diary.findByPk(DiaryId)
    if (!diary) throw new Error('헤당 다이어리가 존재하지 않아요ㅠ')

    const userDiary = await models.UserDiary.findOne({
      where: {
        DiaryId,
        UserId
      }
    })
    if (!userDiary) throw new Error('헤당 다이어리에 작성 권한이 없습니다....')

    await models.DiaryTodoList.create({
      DiaryId,
      UserId,
      title
    })

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}

export const updateTodoList = async (req, res, next) => {
  try {
    const {
      id,
      title,
      isCompleted
    } = req.body

    if (!title) throw new Error('제목을 입력해주세요!')
    if (typeof isCompleted !== 'boolean') throw new Error('완료 여부를 선택해주세요!')

    const diaryTodoList = await models.DiaryTodoList.findByPk(id)
    if (!diaryTodoList) throw new Error('해당 내용이 존재하지 않습니다.')

    if (diaryTodoList.UserId !== req.user.id) {
      throw new Error('내가 등록한 것만 수정 가능합니다!')
    }

    await diaryTodoList.update({
      title,
      isCompleted
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteTodoList = async (req, res, next) => {
  try {
    const diaryTodoList = await models.DiaryTodoList.findByPk(req.params.id)
    if (!diaryTodoList) throw new Error('해당 내용이 존재하지 않습니다.')

    if (diaryTodoList.UserId !== req.user.id) {
      throw new Error('내가 등록한 것만 삭제 가능합니다!')
    }

    await diaryTodoList.destroy()

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}