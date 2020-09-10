import _ from 'lodash'
import moment from 'moment'
import models from '../../models'
import { Op } from 'sequelize'

export const getContentsByDiaryId = async (req, res, next) => {
  try {
    const {
      DiaryId,
      page,
      pageSize,
      startDate,
      endDate,
      title
    } = req.query

    if (!DiaryId) throw new Error('다이어리 ID가 필요합니다.')

    const diary = await models.Diary.findByPk(DiaryId)
    if (!diary) throw new Error('존재하지 않는 다이어리 입니다ㅠㅠ')

    const limit = +pageSize || 12
    const offset = +page ? (+page - 1) * limit : 0

    const where = {
      DiaryId
    }

    if (startDate) {
      where.createdDate = {
        [Op.gte]: startDate
      }
    }

    if (endDate) {
      where.createdDate = where.createdDate || {}
      where.createdDate[Op.lte] = endDate
    }

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`
      }
    }

    const result = await models.DiaryContent.findAndCountAll({
      limit,
      offset,
      where,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'weather', 'feeling', 'createdAt', 'createdDate', 'UserId'],
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name', 'profileImage']
      }]
    })

    const rows = _.chain(result.rows)
      .groupBy('createdDate')
      .map((contents, createdDate) => ({ contents, createdDate }))
      .value();

    result.rows = rows
    res.json(result)

  } catch (err) {
    next(err)
  }
}

export const getContentById = async (req, res, next) => {
  try {
    const diaryContent = await models.DiaryContent.findByPk(req.params.id, {
      include: [{
        model: models.User,
        attributes: ['id', 'email', 'name', 'profileImage']
      }]
    })

    if (!diaryContent) throw new Error('존재하지 않는 다이어리 글입니다.')

    const diaryContentImages = await models.DiaryContentImage.findAll({
      where: {
        DiaryContentId: req.params.id
      },
      attributes: ['id', 'imageUrl']
    })

    res.json({
      ...diaryContent.get(),
      diaryContentImages
    })
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const {
      title,
      weather,
      feeling,
      content,
      DiaryId,
      images
    } = req.body

    const validUserDiary = await models.UserDiary.findOne({
      where: {
        UserId,
        DiaryId
      }
    })

    if (!validUserDiary) throw new Error('다이어리 작성 권한이 없습니다ㅠㅠ')

    const diary = await models.Diary.findByPk(DiaryId)
    if (!diary) throw new Error('존재하지 않는 다이어리 입니다ㅠㅠ')

    if (!title) throw new Error('제목을 입력해주세요!')
    if (!weather) throw new Error('현재 날씨는 어떤가요?')
    if (!feeling) throw new Error('당신의 기분을 알려주세요!')
    if (!content) throw new Error('내용 입력해주세요!')
    if (images.length > 5) throw new Error('이미지는 최대 5개까지 등록 가능합니다ㅠㅠ')

    req.body.UserId = UserId
    req.body.createdDate = moment().format('YYYY-MM-DD')

    const diaryContent = await models.DiaryContent.create(req.body)

    if (images.length) {
      const promises = images.map(imageUrl => {
        return models.DiaryContentImage.create({
          imageUrl,
          DiaryContentId: diaryContent.id
        })
      })

      await Promise.all(promises)
    }

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}

export const updateById = async (req, res, next) => {
  try {
    const {
      title,
      weather,
      feeling,
      content,
      DiaryId,
      images
    } = req.body

    const diary = await models.Diary.findByPk(DiaryId)
    if (!diary) throw new Error('존재하지 않는 다이어리 입니다ㅠㅠ')

    if (!title) throw new Error('제목을 입력해주세요!')
    if (!weather) throw new Error('현재 날씨는 어떤가요?')
    if (!feeling) throw new Error('당신의 기분을 알려주세요!')
    if (!content) throw new Error('내용 입력해주세요!')
    if (images.length > 5) throw new Error('이미지는 최대 5개까지 등록 가능합니다ㅠㅠ')

    const diaryContent = await models.DiaryContent.findOne({
      where: {
        UserId: req.user.id,
        id: req.params.id
      }
    })

    if (!diaryContent) throw new Error('내가 작성한 글만 삭제할 수 있어요.')

    const diaryContentImages = await models.DiaryContentImage.findAll({
      where: {
        DiaryContentId: req.params.id
      }
    })

    const imageUrls = images.map(image => {
      return { imageUrl: image }
    })

    const newImages = _.differenceBy(imageUrls, diaryContentImages, 'imageUrl')
    const deletedImages = _.differenceBy(diaryContentImages, imageUrls, 'imageUrl')

    const newImagePromises = newImages.map(newImage => {
      return models.DiaryContentImage.create({
        imageUrl: newImage.imageUrl,
        DiaryContentId: req.params.id
      })
    })

    const deletedImagePromises = deletedImages.map(deletedImage => {
      return deletedImage.destroy()
    })

    const promises = deletedImagePromises.concat(newImagePromises)


    await Promise.all(promises)

    await diaryContent.update({
      title,
      weather,
      feeling,
      content,
      DiaryId,
    })

    res.sendStatus(200)

  } catch (err) {
    next(err)
  }
}

export const deleteDiaryContent = async (req, res, next) => {
  try {
    const diaryContent = await models.DiaryContent.findByPk(req.params.id)

    if (diaryContent.UserId !== req.user.id) throw new Error('본인의 글만 삭제 할 수 있습니다.')

    // 등록된 이미지 삭제
    await models.DiaryContentImage.destroy({
      where: {
        DiaryContentId: diaryContent.id
      }
    })

    // 등록된 댓글 삭제
    await models.DiaryContentComment.destroy({
      where: {
        DiaryContentId: diaryContent.id
      }
    })

    await diaryContent.destroy()

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}