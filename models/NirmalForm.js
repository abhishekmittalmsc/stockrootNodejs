import mongoose from 'mongoose';




const NirmalForm = mongoose.Schema({

  name: { type: String  },
  email: { type: String },
  mobile: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
},
});


var Nirmal = mongoose.model('NirmalSchema', NirmalForm);

export default Nirmal;

