import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;



const userRegistrationSchema = mongoose.Schema({

    displayName: String,
    email: String,
    uid: String,
    photoURL: String,
    phoneNumber:Number,
    courses: [{
        type: ObjectId,
        ref: 'Courses'
      }],
    cart: [{
        type: ObjectId,
        ref: 'Courses'
      }],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var UserRegistration = mongoose.model('userRegistration', userRegistrationSchema);

export default UserRegistration;

