import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema({
  courseName: { type: Schema.Types.String, required: true },
  coursePoster: { type: Schema.Types.String, required: true },
  courseFees: { type: Schema.Types.String, required: true },
  chapters: [{
    title: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    link: { type: Schema.Types.String, required: true },
    ChapterPoster: { type: Schema.Types.String },
  }],
  comments: [{
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    text: { type: Schema.Types.String, required: true },
  }],
  description:[],
  content:[],
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

const CoursesMaster = mongoose.model('Courses', courseSchema);

export default CoursesMaster;
