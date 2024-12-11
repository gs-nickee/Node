const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.updateOne({ _id: courseId }, {
    $unset: {
      'author': ''
    }
  });
  // course.author.name = 'Mosh Hamedani';
  // course.save();
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const result = await Course.updateOne(
    { _id: courseId },
    { $pull: { authors: { _id: authorId } } }
  );

  if (result.modifiedCount > 0) {
    console.log(`Author with id ${authorId} removed from course ${courseId}`);
  } else {
    console.log(`No author found with id ${authorId} in course ${courseId}`);
  }
}

// createCourse('Node Course', [
//   new Author({ name: 'Mosh1' }),
//   new Author({ name: 'Mosh2' })
// ]);
// updateAuthor('6757e8874f4119d7605ceeda');

// addAuthor('6757eb095b0c069075c47f3c', new Author({ name: 'Mosh11' }))
removeAuthor('6757eb095b0c069075c47f3c', '6757ede82396f7caf07a6fd6');
