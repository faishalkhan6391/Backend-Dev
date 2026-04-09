// Student CRUD Operations

// Add new student
db.students.insertOne({
  name: "John Doe",
  email: "john@example.com",
  gpa: 3.2,
  courses: ["Math", "CS"],
  city: "Delhi"
});

// View all students
db.students.find();

// Find by email
db.students.findOne({ email: "john@example.com" });

// Update GPA
db.students.updateOne(
  { email: "john@example.com" },
  { $set: { gpa: 3.8 } }
);

// Delete student
db.students.deleteOne({ email: "john@example.com" });
