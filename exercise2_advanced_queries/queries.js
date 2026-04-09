// Advanced Queries

// GPA between 3.0 and 3.5
db.students.find({ gpa: { $gte: 3.0, $lte: 3.5 } });

// Students with more than 5 courses
db.students.find({ courses: { $size: 5 } });

// Top 10 students by GPA
db.students.find().sort({ gpa: -1 }).limit(10);

// Count students by city
db.students.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } }
]);
