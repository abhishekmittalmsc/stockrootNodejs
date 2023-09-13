import express from 'express';

import {getBackTestingData, BackTestingExcelUpload,getUserMaster,MailToUsersFromAdmin, getNirmalData,getQueryData, getMRData, AdminAuth, MasterclassRegistration, commentsData, newComment, updateMobileNumber, successPayment, payment, courseDetails, createUser, userDetails,checkExisting, createUserMobileLogin, createQuery, allCourses,addToCart,CartData,CourseData, removeCart, NirmalFormSubmit } from '../controllers/posts.js';


const router = express.Router();

router.post('/save-user-details', createUser)
router.post('/mobile-login', createUserMobileLogin)
router.post('/check-existing', checkExisting)
router.post('/userDetails', userDetails)
router.post('/allCourses', allCourses)
router.post('/addToCart', addToCart)
router.post('/cartData', CartData)
router.post('/courseData', CourseData)
router.post('/removeCart',removeCart)
router.post('/query',createQuery) 
router.post('/payment',payment) 
router.post('/NirmalForm',NirmalFormSubmit) 
router.post('/coursesDetails/:courseId', courseDetails)
router.get('/successPayment/:userId', successPayment)
router.post('/updateMobileNumber',updateMobileNumber) 
router.post('/newComment', newComment)
router.post('/commentsData', commentsData)
router.post('/AdminAuth', AdminAuth)
router.post('/getUserMaster', getUserMaster)
router.post('/getNirmalData', getNirmalData)
router.post('/getQueryData', getQueryData)
router.post('/getMRData', getMRData)
router.post('/MasterclassRegistration', MasterclassRegistration)
router.post('/MailToUsersfromAdmin', MailToUsersFromAdmin)
router.post('/BackTestingExcelUpload', BackTestingExcelUpload)
router.get('/getBackTestingData', getBackTestingData)

export default router;