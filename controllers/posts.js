import express from "express";
import mongoose from "mongoose";
import UserRegistration from "../models/UserRegistrationSchema.js";
import Query from "../models/QuerySchema.js";
import CoursesMaster from "../models/Courses.js";
import NirmalForm from "../models/NirmalForm.js";
import generateToken from "./token.js";
import jwt from "jsonwebtoken";
import { sendEmailToAdmin, sendEmailToUser, sendEmailToUserFromAdmin} from "../middleware/Mailers.js";
import { sendWhatsAppMessage } from "../middleware/Whatsapp.js";
import { createRequire } from "module";
import MasterclassRegistrationSchema from '../models/Masterclass.js'
import BackTestData from '../models/BackTestingExcel.js'
import multer from 'multer'
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs'; // Import exceljs library

const require = createRequire(import.meta.url);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename the file
  },
});
const upload = multer({ storage }).single('file');

const router = express.Router();

export const createUser = async (req, res) => {
  const email = req.body.email; // Assuming the UID is provided in the request body

  try {
    // Check if a user with the same UID already exists
    const existingUser = await UserRegistration.findOne({ email });
    let newUserRegistration = "";
    let token = "";

    if (!existingUser) {
      newUserRegistration = new UserRegistration(req.body);
      await newUserRegistration.save();
      // Assuming the newUserRegistration object contains the user details and the _id
      token = generateToken(newUserRegistration);
    } else {
      newUserRegistration = existingUser;
      token = generateToken(newUserRegistration);
    }

    res.status(201).json({ user: newUserRegistration, token });
    // Create a new user registration entry
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createQuery = async (req, res) => {
  console.log("in createQuery", req.body);
  try {
    const { name, email, phone, city, query } = req.body;

    // Create a new User instance with the form data
    const newQuery = new Query({
      name,
      email,
      phone,
      city,
      query,
    });

    // Save the user data to MongoDB
    await newQuery.save();
    console.log("query saved", newQuery);

    await sendEmailToAdmin(newQuery);
    await sendEmailToUser(newQuery);
    await sendWhatsAppMessage(newQuery);

    // Respond with a success message
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    // Handle error
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const createUserMobileLogin = async (req, res) => {
  const number = req.body.phoneNumber; // Assuming the UID is provided in the request body
  try {
    // Check if a user with the same UID already exists
    const phoneNumber = parseInt(number, 10);
    const existingUser = await UserRegistration.findOne({ phoneNumber });
    let newUserRegistration = "";
    let token = "";
    console.log("existing user", existingUser);

    if (!existingUser) {
      console.log("if create user from mobile", req.body);
      newUserRegistration = new UserRegistration(req.body);
      console.log("new user", req.body);
      await newUserRegistration.save();
      // Assuming the newUserRegistration object contains the user details and the _id
      token = generateToken(newUserRegistration);
    } else {
      console.log("else create user from mobile", req.body);
      newUserRegistration = existingUser;
      token = generateToken(newUserRegistration);
    }

    res.status(201).json({ user: newUserRegistration, token });
    // Create a new user registration entry
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkExisting = async (req, res) => {
  const number = req.body.number; // Assuming the UID is provided in the request body

  try {
    // Check if a user with the same UID already exists
    const existingUser = await UserRegistration.findOne({
      phoneNumber: number,
    });

    if (!existingUser) {
      res.status(201).json({ Resp: "New" });
    } else {
      res.status(201).json({ Resp: "Existing" });
    }
    // Create a new user registration entry
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

function removeDuplicates(arr) {
  const uniqueValues = new Set();
  const result = [];

  for (const item of arr) {
    const stringified = JSON.stringify(item);
    if (!uniqueValues.has(stringified)) {
      result.push(item);
      uniqueValues.add(stringified);
    }
  }

  return result;
}


export const userDetails = async (req, res) => {
  const token = req.body.token;
  try {
    const decodedToken = jwt.verify(token, "Welcome@12345");
    const userId = decodedToken._id;
    const email = decodedToken.email;
    const user = await UserRegistration.findOne({ _id: userId });


    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const allCourses = async (req, res) => {
  try {
    const courseData = await CoursesMaster.find().select('-chapters'); // Exclude the 'chapters' field

    if (courseData) {
      res.status(200).json(courseData);
    } else {
      res.status(404).json({ message: "Courses not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: "Invalid request for Courses" });
  }
};

export const addToCart = async (req, res) => {
  console.log('add to cart called', req.body)
  const { course, userData } = req.body;
  const courseId = course._id;
  // const userId = userData._id;
  const userId = userData._id;

  try {
    const userDetails = await UserRegistration.findOne({ _id: userId });
  
        if (userDetails) {
      userDetails.cart.push(courseId);
      await userDetails.save();

      res.status(200).json({ message: "Course added to cart successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const CartData = async (req, res) => {
  const token=req.body.token
 try {
    const decodedToken = jwt.verify(token, 'Welcome@12345');
    const userDetails = await UserRegistration.findOne({ _id: decodedToken._id });

    if (!userDetails || userDetails.cart === null) {
      res.status(404).json({ message: "User not found or cart is empty" });
      return;
    }

    const cartIds = userDetails.cart;
    const coursesInCart = await CoursesMaster.find({ _id: { $in: cartIds } });
    if (coursesInCart.length > 0) {
      res.status(200).json({ courses: coursesInCart, user: userDetails });
    } else {
      res.status(404).json({ message: "No courses found in the cart" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const CourseData = async (req, res) => {
  const token = req.body.token;
  try {
    const decodedToken = jwt.verify(token, "Welcome@12345");
    const userDetails = await UserRegistration.findOne({
      _id: decodedToken._id,
    });

    if (!userDetails || userDetails.courses === null) {
      res.status(404).json({ message: "User not found or course is empty" });
      return;
    }

    if ( userDetails.courses.length === 0) {
      
      userDetails.courses.push(mongoose.Types.ObjectId("64a11be632143619f09c0b13"));
      await userDetails.save()
    }
    userDetails.courses = removeDuplicates(userDetails.courses);
    userDetails.cart = removeDuplicates(userDetails.cart);
    await userDetails.save();


    const courseIds = userDetails.courses;
    const myCourses = await CoursesMaster.find({ _id: { $in: courseIds } });
    if (myCourses.length > 0) {
      res.status(200).json({ courses: myCourses });
    } else {
      res.status(404).json({ message: "No courses found in the user" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Assuming you're using Express.js
export const removeCart = async (req, res) => {
  const token = req.body.data.token;
  const decodedToken = jwt.verify(token, "Welcome@12345");
  const userId = decodedToken._id;
  const courseId = req.body.data.courseId;
  try {
    // Find the user by userId
    const user = await UserRegistration.findOne({ _id: userId });

    // Remove the course from the cart array
    user.cart = user.cart.filter(
      (cartCourseId) => cartCourseId.toString() !== courseId.toString()
    );

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const NirmalFormSubmit = async (req, res) => {
  const { name, email, mobile } = req.body;

  // Create a new document for the form submission
  const newNirmalForm = new NirmalForm({
    name,
    email,
    mobile,
  });

  // Save the form data to the database
  newNirmalForm.save((err, savedForm) => {
    if (err) {
      console.error("Error saving form data to MongoDB:", err);
      return res
        .status(500)
        .json({ error: "Error saving form data to the database" });
    }

    console.log("Form data saved to MongoDB:", savedForm);
    return res.status(200).json({ message: "Form data saved successfully" });
  });
};

export const courseDetails = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const courseDetails = await CoursesMaster.findOne({ _id: courseId });
    res.json(courseDetails);
    console.log("courseDetails", courseDetails);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Error fetching course details" });
  }
};

//   'Invalid payment_method_types[1]: must be one of card, acss_debit, affirm, afterpay_clearpay, alipay, au_becs_debit, bacs_debit, bancontact, blik, boleto, cashapp, customer_balance, eps, fpx, giropay, grabpay, ideal, klarna, konbini, link, oxxo, p24, paynow, paypal, pix, promptpay, sepa_debit, sofort, us_bank_account, wechat_pay, or zip',

const stripe = require("stripe")(
  "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"
);

export const payment = async (req, res) => {
  const Courses = req.body.items.courses;


  try {
    const userId = req.body.items[0].userId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: "course",
            },
            unit_amount: 1 * 100,
            // unit_amount:(item.amount)*100
          },
          quantity: "1",
        };
      }),
      success_url: `https://api.stockroots.in/api/successPayment/${userId}`,
      cancel_url: `https://www.stockroots.in/dashboard`,


    });
    res.json({ url: session.url });
  } catch (error) {
    console.log("error in payment", error);
    res.status(500).json({ error });
  }
};

export const successPayment = async (req, res) => {
  try {
    // Assuming you have some data available in the query parameters
    const userId = req.params.userId; // Replace with the actual parameter name

    const user = await UserRegistration.findById(userId);
    
    if (user) {
      const cartCourseIds = user.cart;
      if (cartCourseIds.length > 0) {
        // Move the cart course IDs to the courses array
       cartCourseIds.map(courseId=>{
        user.courses = user.courses.concat(courseId);

       })

        
        // Clear the cart
        user.cart = [];

        // Save the updated user document
        await user.save();  

        console.log('Cart data moved to courses array.');
      }
    }

    // Respond to the client
    res.redirect('https://www.stockroots.in/dashboard'); // Replace with the actual URL
  } catch (error) {
    console.error('Error moving cart data to courses:', error);
    res.status(500).json({ error });
  }

};


export const updateMobileNumber = async (req, res) => {
  const userId = req.body.userId;
  const phoneNumber = req.body.phoneNumber;

  try {
    // Find the user by userId and update the mobile number
    const updatedUser = await UserRegistration.findByIdAndUpdate(userId, {
      phoneNumber: phoneNumber,
    }, { new: true }); // { new: true } returns the updated document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Mobile number updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating mobile number:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const newComment = async (req, res) => {
  const commentData = req.body.commentData;
  console.log('commentData', commentData);

  try {
    const courseId = commentData.courseId;

    // Find the course by courseId and update the comments array
    const updatedCourse = await CoursesMaster.findByIdAndUpdate(courseId, {
      $push: {
        comments: {
          name: commentData.userDetails.name,
          email: commentData.userDetails.email,
          text: commentData.comment,
        },
      },
    }, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Comment added successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const commentsData = async (req, res) => {
  const courseId = req.body.courseId;

  try {
    // Find the course by courseId
    const course = await CoursesMaster.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Extract comments array from the course
    const comments = course.comments;

    return res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const AdminAuth = async (req, res) => {
  const secretKey="Welcome@12345"
  const Secret = req.body.passkey; // Assuming the UID is provided in the request body
  
    // Check if a user with the same UID already exists
    if (Secret === 'Welcome@12345') {
      const token = jwt.sign({ user: 'admin' }, secretKey);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
};

export const getUserMaster = async (req, res) => {
  const key=req.body.key;
  if(key==="Welcome@12345"){
    const Users=await UserRegistration.find({})
    return res.status(200).json({ Users });
  }
  else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
};

export const getNirmalData = async (req, res) => {
  const key=req.body.key;
  if(key==="Welcome@12345"){
    const Nirmal=await NirmalForm.find({})
    return res.status(200).json({ Nirmal });
  }
  else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
};

export const getQueryData = async (req, res) => {
  console.log('in get Query Data')
  const key=req.body.key;
  if(key==="Welcome@12345"){
    const QueryData=await Query.find({})
    return res.status(200).json({ QueryData });
    console.log('querydata', QueryData)
  }
  else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
};

export const getMRData = async (req, res) => {
  console.log('in get MR Data')
  const key=req.body.key;
  if(key==="Welcome@12345"){
    const MRData=await MasterclassRegistrationSchema.find({})
    return res.status(200).json({ MRData });
    console.log('querydata', MRData)
  }
  else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
};




export const MasterclassRegistration = async (req, res) => {
  try {
    // Check if a user with the same UID already exists
    let newUserRegistration = "";
   
      newUserRegistration = new MasterclassRegistrationSchema(req.body.formData);
      await newUserRegistration.save()
    res.status(201).json({ user: newUserRegistration });
    // Create a new user registration entry
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const MailToUsersFromAdmin = async (req, res)=>{
  try {
    upload(req, res, async (uploadErr) => {
      if (uploadErr) {
        console.error('Error uploading file:', uploadErr);
        return res.status(400).json({ error: 'File upload failed' });
      }

      const { recipients, subject, body } = req.body;
      const fileContent = fs.readFileSync(req.file.path, 'utf-8');
      const query={recipients, subject,body,fileContent}
      sendEmailToUserFromAdmin(query)
      // Rest of your email sending logic using Nodemailer
      // ...

      res.status(200).json({ message: 'Email sent successfully' });
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }

}

export const BackTestingExcelUpload = async (req, res) => {
  try {
    const { stockRootsStrategy, year, entryMonth, lotSize, expiryDate, entryDate, exitDate, investment, returnA, returnPercentage } = req.body;

    const newData = new BackTestData({
      stockRootsStrategy,
      year,
      entryMonth,
      lotSize,
      expiryDate: new Date(expiryDate),
      entryDate: new Date(entryDate),
      exitDate: new Date(exitDate),
      investment,
      returnA,
      returnPercentage,
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getBackTestingData = async (req, res) => {
  console.log('in backtesting data', BackTestData)

  try {
    const Backtest=await BackTestData.find({})
    console.log('backtest', Backtest)
      res.status(200).json({ data: Backtest })
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
};



export default router;
