import { Router } from 'express'

import adminRouter from './admin'
import fileRoute from './file'
import * as auth from './auth'
import * as user from './users'
import * as diary from './diary'
import * as userDiary from './userDiary'
import * as diaryContent from './diaryContent'
import * as diaryContentComment from './diaryContentComment'
import * as diarySchedule from './diarySchedule'
import * as diaryTodoList from './diaryTodoList'
import * as notice from './notice'
import * as qna from './qna'

import { authenticate, validateAdmin } from '../../lib/middlewares'

const router = Router()

/**
 * GET home page
 */

router.get('/', (req, res) => {
  res.json({
    version: 'v1.0'
  })
})

router.use('/files', fileRoute)

/**
 * Admin
 */
router.use('/admin', validateAdmin, adminRouter)


/**
 * Authentication
 */
router.post('/auth-token', auth.authenticateToken)
router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.post('/dupl-email', auth.duplEmail)
router.post('/find-password', auth.findPassword)

/**
 * Users
 */
const userPrefix = '/users'
router.get(`${userPrefix}`, authenticate, user.getUser)
router.put(`${userPrefix}`, authenticate, user.updateUser)
router.put(`${userPrefix}/password`, authenticate, user.resetPassword)
router.delete(`${userPrefix}/withdrawal`, authenticate, user.withdrawal)

/**
 * Diaries
 */
const dairyPrefix = '/diaries'
router.get(`${dairyPrefix}/search`, diary.searchDiaryById)
router.get(`${dairyPrefix}/:id`, diary.getById)
router.post(`${dairyPrefix}`, authenticate, diary.create)
router.post(`${dairyPrefix}/dupl-diaryId`, diary.duplDiaryId)
router.post(`${dairyPrefix}/valid-password`, diary.validEnterDiary)
router.put(`${dairyPrefix}/password`, authenticate, diary.updateDiaryPw)
router.put(`${dairyPrefix}/:id`, authenticate, diary.updateById)
router.delete(`${dairyPrefix}/:id`, authenticate, diary.deleteById)

/**
 * UserDiary
 */
const userDiaryPrefix = '/user-diaries'
router.get(`${userDiaryPrefix}`, authenticate, userDiary.userDiaries)
router.post(`${userDiaryPrefix}`, authenticate, userDiary.addUserDiary)
router.post(`${userDiaryPrefix}/valid`, authenticate, userDiary.validUserDiary)
router.delete(`${userDiaryPrefix}`, authenticate, userDiary.deleteUserDiary)

/**
 * diaryContent
 */
const diaryContentPrefix = '/diary-contents'
router.get(`${diaryContentPrefix}`, diaryContent.getContentsByDiaryId)
router.get(`${diaryContentPrefix}/:id`, diaryContent.getContentById)
router.post(`${diaryContentPrefix}`, authenticate, diaryContent.create)
router.put(`${diaryContentPrefix}/:id`, authenticate, diaryContent.updateById)
router.delete(`${diaryContentPrefix}/:id`, authenticate, diaryContent.deleteDiaryContent)

/**
 * diaryContentComment
 */
const diaryContentCommentPrefix = '/diary-content-comments'
router.get(`${diaryContentCommentPrefix}`, diaryContentComment.getComments)
router.post(`${diaryContentCommentPrefix}`, authenticate, diaryContentComment.createComment)
router.put(`${diaryContentCommentPrefix}/:id`, authenticate, diaryContentComment.updateCommentById)
router.delete(`${diaryContentCommentPrefix}/:id`, authenticate, diaryContentComment.deleteCommentById)

/**
 * diarySchedule
 */
const diarySchedulePrefix = '/diary-schedules'
router.get(`${diarySchedulePrefix}`, diarySchedule.getSchedules)
router.post(`${diarySchedulePrefix}`, authenticate, diarySchedule.createSchedule)
router.put(`${diarySchedulePrefix}`, authenticate, diarySchedule.updateSchedule)
router.delete(`${diarySchedulePrefix}/:id`, authenticate, diarySchedule.deleteSchedule)

/**
 * diaryTodoList
 */
const diaryTodoListPrefix = '/diary-todo-lists'
router.get(`${diaryTodoListPrefix}`, diaryTodoList.getTodoLists)
router.post(`${diaryTodoListPrefix}`, authenticate, diaryTodoList.createTodoList)
router.put(`${diaryTodoListPrefix}`, authenticate, diaryTodoList.updateTodoList)
router.delete(`${diaryTodoListPrefix}/:id`, authenticate, diaryTodoList.deleteTodoList)

/**
 * notice
 */
const noticePrefix = '/notices'
router.get(`${noticePrefix}`, notice.get)
router.get(`${noticePrefix}/:id`, notice.getById)

/**
 * qna
 */
const qnaPrefix = '/qnas'
router.get(`${qnaPrefix}`, authenticate, qna.getMyQnas)
router.post(`${qnaPrefix}`, authenticate, qna.createQna)
router.put(`${qnaPrefix}/:id`, authenticate, qna.updateQnaById)
router.delete(`${qnaPrefix}/:id`, authenticate, qna.deleteQnaById)

export default router
