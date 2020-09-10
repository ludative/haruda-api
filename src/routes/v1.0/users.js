import bcrypt from 'bcrypt-nodejs'
import { Op } from 'sequelize'
import models from '../../models'

export const getUser = async (req, res, next) => {
  try {
    const user = await models.User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      }
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const {
      password,
      newPassword
    } = req.body

    const user = await models.User.findByPk(req.user.id)

    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) throw new Error('현재 비밀번호가 일치하지 않습니다.')
    if (password === newPassword) {
      throw new Error('새로운 비밀번호가 현재 비밀번호와 일치합니다.')
    }

    await user.update({
      password: bcrypt.hashSync(newPassword)
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const withdrawal = async (req, res, next) => {
  try {
    const diaryIdWhere = {}
    const diaryContentIdWhere = {}
    const userDiaryContentWhere = {}
    const userWhere = {
      UserId: req.user.id
    }

    // 생성한 다이어리 찾기
    const createdDiaries = await models.Diary.findAll({
      where: userWhere
    })

    diaryIdWhere.DiaryId = {
      [Op.or]: createdDiaries.map(diary => diary.id)
    }

    // 생성한 다이어리의 글 찾기
    const createdDiariesContents = await models.DiaryContent.findAll({
      where: diaryIdWhere
    })

    diaryContentIdWhere.DiaryContentId = {
      [Op.or]: createdDiariesContents.map(content => content.id)
    }

    const userDiaryContents = await models.DiaryContent.findAll({
      where: userWhere
    })
    userDiaryContentWhere.DiaryContentId = {
      [Op.or]: userDiaryContents.map(content => content.id)
    }

    if (diaryIdWhere.DiaryId[Op.or].length) {
      // 생성한 다이어리에 권한있는 유저 전부 삭제
      await models.UserDiary.destroy({
        where: diaryIdWhere
      })

      // 생성한 다이어리의 글 전부 삭제
      await models.DiaryContent.destroy({
        where: diaryIdWhere
      })
      // 생성한 다이어리의 일정 전부 삭제
      await models.DiarySchedule.destroy({
        where: diaryIdWhere
      })

      // 생성한 다이어리의 일정 전부 삭제
      await models.DiaryTodoList.destroy({
        where: diaryIdWhere
      })
    }

    if (userDiaryContentWhere.DiaryContentId[Op.or].length) {
      // 내가 생성한 다이어리 글 삭제
      await models.DiaryContent.destroy({
        where: userDiaryContentWhere
      })
      // 내가 생성한 다이어리 댓글 삭제
      await models.DiaryContentComment.destroy({
        where: userDiaryContentWhere
      })
      // 내가 생성한 다이어리 글 이미지 삭제
      await models.DiaryContentImage.destroy({
        where: userDiaryContentWhere
      })
    }

    if (diaryContentIdWhere.DiaryContentId[Op.or].length) {
      // 생성한 다이어리 글의 댓글 전부 삭제
      await models.DiaryContentComment.destroy({
        where: diaryContentIdWhere
      })


      // 생성한 다이어리 글의 이미지 전부 삭제
      await models.DiaryContentImage.destroy({
        where: diaryContentIdWhere
      })
    }

    // 권한이 있는 다이어리에서 사용자 삭제
    await models.UserDiary.destroy({
      where: userWhere
    })

    // 내가 등록한 일정 삭제
    await models.DiarySchedule.destroy({
      where: userWhere
    })

    // 내가 등록한 투두리스트 삭제
    await models.DiaryTodoList.destroy({
      where: userWhere
    })

    // 생성한 다이어리 전부 삭제
    await models.Diary.destroy({
      where: userWhere
    })

    // 내가 등록한 QnA 삭제
    await models.Qna.destroy({
      where: userWhere
    })

    await models.User.destroy({
      where: {
        id: req.user.id
      }
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const {
      name,
      profileImage
    } = req.body

    const user = await models.User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      }
    })

    if (!user) throw new Error('존재하지 않는 회원입니다.')
    if (!name) throw new Error('당신의 이름을 알려주세요ㅠㅠ')

    await user.update({
      name,
      profileImage
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
}
