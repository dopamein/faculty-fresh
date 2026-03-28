const mongoose = require("mongoose");
const { seedDatabase } = require("./backend/seed");

const URI = "mongodb+srv://chaboling8_db_user:I4aGBXPFUnESXpB6@faculty.sxpq8j9.mongodb.net/?retryWrites=true&w=majority&appName=Faculty";

async function testConnection() {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("SUCCESS! Connected to MongoDB Atlas.");
    
    console.log("Seeding Database...");
    await seedDatabase();
    console.log("Database seeded successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("CONNECTION FAILED:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
