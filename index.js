
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/api', postRoutes);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

const CONNECTION_URL = 'mongodb+srv://abhishekmittalmsc:Welcome@12345@cluster0.xumjs83.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 8001;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

  // const sampleCourse = new CoursesMaster({
  //   courseName: 'Sample Course',
  //   coursePoster: 'sample_poster.jpg',
  //   courseFees: '100',
  //   chapters: [
  //     { title: 'Chapter 1', link: 'chapter1.pdf', ChapterPoster:'abc.jpeg' },
  //     { title: 'Chapter 2', link: 'chapter2.pdf', ChapterPoster:'abcd.jpeg' },
  //   ],
  // });
  
  // // Save the sample course to the database
  // sampleCourse.save()
  //   .then(() => {
  //     console.log('Sample course added successfully');})



mongoose.set('useFindAndModify', false);