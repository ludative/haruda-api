import models from '../../models'
import bcrypt from 'bcrypt-nodejs'
import { Op } from 'sequelize'

export const duplDiaryId = async (req, res, next) => {
  try {
    const {
      diaryId
    } = req.body

    const diary = await models.Diary.findOne({
      where: {
        diaryId
      }
    })

    res.json({
      isDuplDairyId: !!diary
    })
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const {
      title,
      diaryId,
      diaryPw
    } = req.body

    if (!title) throw new Error('다이어리 제목을 입력해주세요.')
    if (!diaryId) throw new Error('다이어리 ID를 입력해주세요.')
    if (!diaryPw) throw new Error('다이어리 비밀번호를 입력해주세요.')

    req.body.diaryPw = bcrypt.hashSync(diaryPw)
    req.body.UserId = req.user.id

    const diary = await models.Diary.create(req.body)
    await models.UserDiary.create({
      UserId: req.user.id,
      DiaryId: diary.id
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const searchDiaryById = async (req, res, next) => {
  try {
    const { diaryId } = req.query
    if (!diaryId) throw new Error('다이어리 아이디를 입력해주세요.')

    const diary = await models.Diary.findOne({
      where: {
        diaryId
      },
      attributes: {
        exclude: ['diaryPw']
      },
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name']
      }]
    })

    if (!diary) throw new Error('다이어리를 찾지 못했어요ㅠㅠ')
    res.json(diary)
  } catch (err) {
    next(err)
  }
}

export const validEnterDiary = async (req, res, next) => {
  try {
    const {
      diaryId,
      diaryPw
    } = req.body

    if (!diaryId) throw new Error('다이어리 아이디를 입력해주세요.')
    if (!diaryPw) throw new Error('다이어리 비밀번호를 입력해주세요.')

    const diary = await models.Diary.findOne({
      where: {
        diaryId
      },
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name']
      }]
    })

    const validDairyPw = bcrypt.compareSync(diaryPw, diary.diaryPw)

    if (!validDairyPw) throw new Error('다이어리 비밀번호가 틀렸어요!')

    const _diary = diary.get()
    delete _diary.diaryPw

    res.json(_diary)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const diary = await models.Diary.findByPk(req.params.id, {
      attributes: {
        exclude: ['diaryPw']
      },
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name']
      }]
    })

    if (!diary) throw new Error('존재하지 않는 다이어리 입니다.')
    res.json(diary)
  } catch (err) {
    next(err)
  }
}

export const updateById = async (req, res, next) => {
  try {
    const {
      title,
    } = req.body

    if (!title) throw new Error('다이어리 제목을 입력해주세요.')

    const diary = await models.Diary.findByPk(req.params.id)

    if (diary.UserId !== req.user.id) {
      throw new Error('다이어리를 관리자만 수정 가능합니다.')
    }

    await diary.update(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const updateDiaryPw = async (req, res, next) => {
  try {
    const {
      id,
      diaryPw,
      newDiaryPw
    } = req.body

    const diary = await models.Diary.findByPk(id)

    if (diary.UserId !== req.user.id) {
      throw new Error('다이어리를 관리자만 삭제 가능합니다.')
    }

    const validPassword = bcrypt.compareSync(diaryPw, diary.diaryPw)
    if (!validPassword) throw new Error('현재 비밀번호와 일치하지 않습니다!')

    await diary.update({
      diaryPw: bcrypt.hashSync(newDiaryPw)
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteById = async (req, res, next) => {
  try {
    const diary = await models.Diary.findByPk(req.params.id)

    if (diary.UserId !== req.user.id) {
      throw new Error('다이어리를 관리자만 삭제 가능합니다.')
    }

    const diaryWhere = {
      DiaryId: diary.id
    }

    const diaryContents = await model.DiaryContent.findAll({
      where: diaryWhere
    })

    const diaryContentWhere = {
      DiaryContentId: {
        [Op.or]: diaryContents.map(content => content.id)
      }
    }

    // 다이어리 권한 리스트에서 삭제
    await models.UserDiary.destroy({
      where: diaryWhere
    })

    // 일정 삭제
    await models.DiarySchedule.destroy({
      where: diaryWhere
    })

    // 투두리스트 삭제
    await models.DiaryTodoList.destroy({
      where: diaryWhere
    })

    if (diaryContentWhere.DiaryContentId[Op.or].length) {
      // 댓글 삭제
      await models.DiaryContentComment.destroy({
        where: diaryContentWhere
      })

      // 다이어리 글 이미지 삭제
      await models.DiaryContentImage.destroy({
        where: diaryContentWhere
      })
    }

    // 다이어리 글 삭제
    await models.DiaryContent.destroy({
      where: diaryWhere
    })

    await diary.destroy()

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}

