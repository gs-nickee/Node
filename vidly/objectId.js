const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
console.log(id.getTimestamp);

const isValid1 = mongoose.Types.ObjectId.isValid('1234');
const isValid2 = mongoose.Types.ObjectId.isValid(id);