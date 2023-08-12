// import express from 'express';
// // import mongoose from 'mongoose';
// import UserRegistration from '../models/UserRegistrationSchema'
// const router = express.Router();


// export const createUser = async (req, res) => {
//     console.log('create user called')
//     const { userName, MailID, pin, city, state, country, mobileNumber } = req.body;

//     const newUserRegistration = new UserRegistration({ userName, MailID, pin, city, state, country, mobileNumber})

//     try {
//         await newUserRegistration.save();

//         res.status(201).json(newUserRegistration );
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// }

// export default router;