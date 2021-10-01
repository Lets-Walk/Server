import express from 'express'
import authController from './controller/auth.controller'
import campusController from './controller/campus.controller'
import userController from './controller/user.controller'

const router = express.Router()

router.use('/auth', authController)
router.use('/user', userController)
router.use('/campus', campusController)
// router.use('/maps', mapController)
// router.use('/walkingcrew', walkingcrewController)

export default router
