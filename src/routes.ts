import express from 'express'
import authController from './controller/auth.contoller'

const router = express.Router()

router.use('/auth', authController)
// router.use('/users', userContoller)
// router.use('/campus', campusContoller)
// router.use('/maps', mapContoller)
// router.use('/walkingcrew', walkingcrewContoller)

export default router
