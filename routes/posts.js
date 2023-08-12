import express from 'express';

import {successPayment, payment, courseDetails, createUser, userDetails,checkExisting, createUserMobileLogin, createQuery, allCourses,addToCart,CartData,CourseData, removeCart, NirmalFormSubmit } from '../controllers/posts.js';


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
router.post('/payment',payment) 
router.post('/NirmalForm',NirmalFormSubmit) 
router.post('/coursesDetails/:courseId', courseDetails)
router.get('/successPayment/:userId', successPayment)


export default router;