import express from 'express'
import authController from './controller/auth.controller'
import campusController from './controller/campus.controller'
import mapController from './controller/map.controller'
import userController from './controller/user.controller'

const router = express.Router()

router.use('/auth', authController)
router.use('/user', userController)
router.use('/campus', campusController)
router.use('/map', mapController)
// router.use('/walkingcrew', walkingcrewController)

export default router
