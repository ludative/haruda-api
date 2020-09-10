import { Router } from 'express'

import * as users from './users'
import * as notice from './notice'
import * as qna from './qna'

const router = Router()

/**
 * Users
 */
router.get('/users', users.get)
router.post('/users/admin', users.createAdmin)

/**
 * notice
 */
const noticePrefix = '/notices'
router.get(`${noticePrefix}`, notice.get)
router.get(`${noticePrefix}/:id`, notice.getById)
router.post(`${noticePrefix}`, notice.create)
router.put(`${noticePrefix}/:id`, notice.updateById)
router.delete(`${noticePrefix}/:id`, notice.deleteById)

/**
 * qna
 */
const qnaPrefix = '/qnas'
router.get(`${qnaPrefix}`, qna.getQnas)
router.get(`${qnaPrefix}/:id`, qna.getQnaById)
router.post(`${qnaPrefix}`, qna.createAnswer)

export default router
