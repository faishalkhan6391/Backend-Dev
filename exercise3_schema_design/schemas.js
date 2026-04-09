const mongoose = require("mongoose");

// Course schema
const courseSchema = new mongoose.Schema({
  name: String,
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

// Professor schema
const professorSchema = new mongoose.Schema({
  name: String,
  departments: [String]
});

// Grade schema
const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  grade: String
});

module.exports = {
  Course: mongoose.model("Course", courseSchema),
  Professor: mongoose.model("Professor", professorSchema),
  Grade: mongoose.model("Grade", gradeSchema)
};
