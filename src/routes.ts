import express from 'express'
import authController from './controller/auth.controller'
import campusController from './controller/campus.controller'

const router = express.Router()

router.use('/auth', authController)
// router.use('/users', userContoller)
router.use('/campus', campusController)
// router.use('/maps', mapContoller)
// router.use('/walkingcrew', walkingcrewContoller)

export default router
