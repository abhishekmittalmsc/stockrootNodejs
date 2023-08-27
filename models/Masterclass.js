import mongoose from 'mongoose';

const Masterclass = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    date: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var MasterclassRegistrationSchema = mongoose.model('MasterClass', Masterclass);

export default MasterclassRegistrationSchema;