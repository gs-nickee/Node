const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true, // auto convert to lowercase/uppercase
        trim: true
    },
    author: String,
    tags: {
        type: [String],
        validate: {
            validator: function (v) {
                return new Promise((resolve, reject) => {
                    // simulate async operation
                    setTimeout(() => {
                        const result = v && v.length > 0;
                        if (result) {
                            resolve(true);  // validation passes
                        } else {
                            reject(new Error('A course should have at least 1 tag.'));
                        }
                    }, 4000);
                });
            },
            message: 'A course should have at least 1 tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () { return this.isPublished; },
        min: 10,
        max: 200,
        get: v => Math.round(v), // auto rounding
        set: v => Math.round(v)
    }
})

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    // const course = new Course({
    //     name: 'Node.js course',
    //     author: 'Mosh',
    //     tags: ['node', 'js', 'backend'],
    //     isPublished: true
    // });

    // const course = new Course({
    //     name: 'react course',
    //     category: 'mobile',
    //     author: 'Mosh',
    //     tags: ['react', 'js', 'frontend'],
    //     isPublished: true,
    //     price: 20
    // });

    const course = new Course({
        name: 'react course',
        category: '-',
        author: 'Mosh',
        tags: [],
        isPublished: true,
        price: 20
    });

    try {
        // await course.validate((err) => {
        // }); // returns void, not bool, need add callback error as param if needed
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}

createCourse();

async function getCourses() {
    const courses = await Course.find(); // add .countDocuments() to get number of count
    console.log(courses);
}

async function getBasicFilteredCourses() {
    const courses = await Course.find({ name: 'react course' });

    const courses2 = await Course
        .find({ name: 'react course', isPublished: true })
        .limit(10)
        .sort({ name: 1 })//sort by name, 1 asc, -1 desc
        .select({ name: 1, tags: 1 }); //to only get these 2 properties, id will be returned by default 
    console.log(courses);
}

async function getBasicFilteredByStringCourses() {
    const courses = await Course.find({ name: 'react course' });

    const courses2 = await Course
        .find({ name: 'react course', isPublished: true })
        .limit(10)
        .sort('-name') // sort by name desc
        .select('name author'); //to only get these 2 properties, id will be returned by default 
    console.log(courses);
}

async function getComparisonQueryCourses() {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equals to)
    // lt (less than)
    // lte (less than or equals to)
    // in
    // nin (not in)

    const courses = await Course.find({ price: { $gte: 10, $lte: 20 } });
    // const courses = await Course.find({price: { $in: [10,15,20] }});
    console.log(courses);
}

async function getLogicalQueryCourses() {
    // or
    // and

    const courses = await Course.find()
        .or([{ author: 'Mosh' }, { isPublished: true }])
        .and([]);
    console.log(courses);
}

async function getRegexCourses() {
    // starts with mosh
    const courses = await Course.find({ author: /^Mosh/ });

    // ends with hamedani
    const courses2 = await Course.find({ author: /Hamedani$/ });

    // ends with hamedani (case insensitive)
    const courses3 = await Course.find({ author: /Hamedani$/i });

    // contains mosh
    const courses4 = await Course.find({ author: /.*Mosh.*/ }); // add i at the back for case insensitive

    console.log(courses);
}

async function getPagedCourses() {
    const pageNum = 2;
    const pageSize = 10;

    const courses = await Course.find()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize); // add .countDocuments() to get number of count
    console.log(courses);
}


// getCourses();

async function updateCourseUpdateFirst(id) {
    const result = await Course.updateOne({ _id: id }, {
        $set: {
            author: 'Mosh',
            isPublished: false
        }
    });
    console.log(result);
}

async function updateCourseQueryFirst(id) {
    const course = await Course.findById(id);
    if (!course) return;
    course.isPublished = true;
    course.author = 'Another Author';
    const result = await course.save();
    console.log(result);
}

async function updateCourseQueryFirstReturnDOc(id) {
    const course = await Course.updateOne(id, {
        $set: {
            author: 'Mosh',
            isPublished: false
        }
    }, { new: true }); // without this, it will return the old doc
    console.log(course);
}

// updateCourseQueryFirst('67569de1c7c8ccddf01eea09');

async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id }); // or can use deleteMany
    // const course = Course.findByIdAndDelete(id); // to return a course obj
    console.log(result); // result obj -> num of docs deleted
}

// removeCourse('67569de1c7c8ccddf01eea09');