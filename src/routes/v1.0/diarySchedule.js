import models from '../../models'
import moment from 'moment'

import { sortByKeyAsc } from '../../lib/common'

export const getSchedules = async (req, res, next) => {
  try {
    const {
      DiaryId
    } = req.query

    if (!DiaryId) throw new Error('다이어리 ID가 없습니다!')

    const schedules = await models.DiarySchedule.findAll({
      where: {
        DiaryId
      },
      order: [['date', 'DESC']],
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'email']
      }]
    })

    const today = moment().startOf('day').format('x')
    const dDay = schedules.filter(schedule => moment(schedule.date).startOf('day').format('x') === today)
    const comming = sortByKeyAsc(schedules.filter(schedule => moment(schedule.date).startOf('day').format('x') > today), 'date')
    const past = schedules.filter(schedule => moment(schedule.date).startOf('day').format('x') < today)

    res.json({ dDay, past, comming })
  } catch (err) {
    next(err)
  }
}

export const createSchedule = async (req, res, next) => {
  try {
    const {
      DiaryId,
      title,
      date
    } = req.body
    const UserId = req.user.id

    if (!title) throw new Error('일정 제목을 입력해주세요!')
    if (!date) throw new Error('날짜를 선택해주세요!')
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

    await models.DiarySchedule.create({
      DiaryId,
      UserId,
      date,
      title
    })

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}

export const updateSchedule = async (req, res, next) => {
  try {
    const {
      id,
      title,
      date
    } = req.body

    if (!title) throw new Error('일정 제목을 입력해주세요!')
    if (!date) throw new Error('날짜를 선택해주세요!')

    const diarySchedule = await models.DiarySchedule.findByPk(id)
    if (!diarySchedule) throw new Error('해당 일정이 존재하지 않습니다.')

    if (diarySchedule.UserId !== req.user.id) {
      throw new Error('내가 등록한 일정만 수정 가능합니다!')
    }

    await diarySchedule.update({
      title,
      date
    })

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

export const deleteSchedule = async (req, res, next) => {
  try {
    const diarySchedule = await models.DiarySchedule.findByPk(req.params.id)
    if (!diarySchedule) throw new Error('해당 일정이 존재하지 않습니다.')

    if (diarySchedule.UserId !== req.user.id) {
      throw new Error('내가 등록한 일정만 삭제 가능합니다!')
    }

    await diarySchedule.destroy()

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}