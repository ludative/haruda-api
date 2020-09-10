import models from '../../models'
import { Op } from 'sequelize'

export const addUserDiary = async (req, res, next) => {
  try {
    const {
      DiaryId
    } = req.body

    if (!DiaryId) throw new Error('다이어리 ID가 없습니다.')

    const diary = await models.Diary.findByPk(DiaryId)

    if (!diary) throw new Error('해당 다이어리가 존재하지 않습니다ㅠ')

    const userDiary = await models.UserDiary.findOne({
      where: {
        UserId: req.user.id,
        DiaryId
      }
    })

    if (userDiary) throw new Error('이미 추가된 다이어리 입니다.')

    await models.UserDiary.create({
      UserId: req.user.id,
      DiaryId
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const userDiaries = async (req, res, next) => {
  try {
    const {
      page,
      pageSize
    } = req.query

    const limit = +pageSize || 10
    const offset = ((+page || 1) - 1) * (pageSize || 10)

    const result = await models.UserDiary.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.user.id
      },
      include: [{
        model: models.Diary,
        attributes: ['id', 'title', 'desc', 'mainImage']
      }]
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const validUserDiary = async (req, res, next) => {
  try {
    const {
      DiaryId
    } = req.body

    if (!DiaryId) throw new Error('다이어리 ID가 없습니다.')

    const diary = await models.Diary.findByPk(DiaryId)

    if (!diary) throw new Error('해당 다이어리가 존재하지 않습니다ㅠ')

    const userDiary = await models.UserDiary.findOne({
      where: {
        UserId: req.user.id,
        DiaryId
      }
    })

    res.json({
      isUserDiary: !!userDiary
    })
  } catch (err) {
    next(err)
  }
}

export const deleteUserDiary = async (req, res, next) => {
  try {
    const {
      DiaryId
    } = req.body

    const userWhere = {
      UserId: req.user.id
    }

    const diary = await models.Diary.findByPk(DiaryId)

    if (diary.UserId === req.user.id) {
      throw new Error('내가 생성한 다이어리는 리스트에서 삭제할 수 없습니다.')
    }

    await models.DiarySchedule.destroy({
      where: userWhere
    })

    await models.DiaryTodoList.destroy({
      where: userWhere
    })

    const contents = await models.DiaryContent.findAll({
      where: userWhere
    })

    const contentIds = contents.map(content => content.id)

    if (contentIds.length) {
      await models.DiaryContentImage.destroy({
        where: {
          DiaryContentId: {
            [Op.or]: contentIds
          }
        }
      })

      await models.DiaryContentComment.destroy({
        where: {
          DiaryContentId: {
            [Op.or]: contentIds
          }
        }
      })
    }

    await models.DiaryContentComment.destroy({
      where: userWhere
    })

    await models.DiaryContent.destroy({
      where: userWhere
    })

    await models.UserDiary.destroy({
      where: {
        UserId: req.user.id,
        DiaryId: diary.id
      }
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}