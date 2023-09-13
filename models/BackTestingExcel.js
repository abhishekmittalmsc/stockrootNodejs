import mongoose from 'mongoose';

const BackTestingSchema = mongoose.Schema({
  stockRootsStrategy: String,
  year: Number,
  entryMonth: String,
  lotSize: Number,
  expiryDate: String,
  entryDate: String,
  exitDate: String,
  investment: Number,
  returnA: Number,
  returnPercentage: Number,
});

const BackTestData = mongoose.model('BackTestingData', BackTestingSchema);

export default BackTestData;
