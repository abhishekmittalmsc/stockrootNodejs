import mongoose from 'mongoose';




const QuerySchema = mongoose.Schema({

  name: { type: String  },
  email: { type: String },
  phone: { type: String },
  city: { type: String  },
  query: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
},
});


var Query = mongoose.model('QuerySchema', QuerySchema);

export default Query;

