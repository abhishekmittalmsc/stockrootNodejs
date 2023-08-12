import mongoose from 'mongoose';




const NirmalForm = mongoose.Schema({

  name: { type: String  },
  email: { type: String },
  mobile: { type: String },
});


var Nirmal = mongoose.model('NirmalSchema', NirmalForm);

export default Nirmal;

