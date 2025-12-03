const mongoose = require('mongoose');
require('dotenv').config();


async function connectMongo() {
const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI not set in env');
await mongoose.connect(uri, {
useNewUrlParser: true,
useUnifiedTopology: true
});
console.log('Connected to MongoDB');
}


module.exports = { connectMongo, mongoose };