// Aggregation Pipelines

// Average GPA by department
db.students.aggregate([
  { $group: { _id: "$department", avgGPA: { $avg: "$gpa" } } }
]);

// Most popular courses
db.students.aggregate([
  { $unwind: "$courses" },
  { $group: { _id: "$courses", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Student performance report
db.students.aggregate([
  {
    $project: {
      name: 1,
      gpa: 1,
      performance: {
        $cond: [{ $gte: ["$gpa", 3.5] }, "Excellent", "Average"]
      }
    }
  }
]);
