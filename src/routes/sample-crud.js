import models from '../models'
import config from '../../config'

export const get = async (req, res, next) => {
  const query = req.query

  const page = Number(query.page || config.pagination.defaultPage)
  const pageSize = Number(query.pageSize || config.pagination.defaultPageSize)

  try {
    const posts = await models.Post.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize
    })

    res.set('x-page', page)
    res.set('x-page-size', pageSize)
    res.json(posts)
  } catch (err) {
    next(err)
  }
}
export const post = async (req, res, next) => {
  const postBody = req.body

  try {
    const newPost = await models.User.create(postBody)
    res.json({ newPostId: newPost.id })
  } catch (err) {
    next(err)
  }
}

export const put = async (req, res, next) => {
  const id = req.params.id
  const postBody = req.body

  try {
    const updatedPost = await models.Post.update(postBody, {
      where: { id }
    })

    res.json({ updatedPostId: updatedPost.id })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  const id = req.params.id

  try {
    await models.Post.update(
      {
        deleted: true
      },
      {
        where: { id }
      }
    )

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
