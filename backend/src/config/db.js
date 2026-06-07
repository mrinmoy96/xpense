// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const mongoUri = process.env.MONGODB_URI;
//     if (!mongoUri) {
//       throw new Error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env and set MONGODB_URI.');
//     }

//     const conn = await mongoose.connect(mongoUri, {
//       // Mongoose 8 has sane defaults; add extras only if needed
//     });
//     console.log(`✅  MongoDB connected → ${conn.connection.host}`);

//     mongoose.connection.on('error',        err  => console.error('MongoDB error:',       err));
//     mongoose.connection.on('disconnected', ()   => console.warn('MongoDB disconnected'));
//     mongoose.connection.on('reconnected',  ()   => console.log ('MongoDB reconnected'));

//   } catch (err) {
//     console.error(`❌  MongoDB connection failed: ${err.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected → ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;