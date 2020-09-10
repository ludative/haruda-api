/**
 * IGNORE ESLINT RULE
 */

import { Router } from 'express'

import router_v_1_0 from './v1.0'

const router = Router()

router.use('/v1.0', router_v_1_0)

export default router
