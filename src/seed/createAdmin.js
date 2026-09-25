import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const createAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MongoDB connection error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully.");

    // Command-line args: node src/seed/createAdmin.js [email] [password] [name]
    const email = (process.argv[2] || "admin@doctortracker.com").toLowerCase().trim();
    const password = process.argv[3] || "Admin123!";
    const name = process.argv[4] || "System Admin";

    // Check if user already exists
    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`ℹ️ Admin user already exists with email: ${email}`);
      console.log("Updating password and name...");
      admin.name = name;
      admin.password = password; // pre-save hook will hash it
      await admin.save();
      console.log("✅ Admin credentials updated successfully.");
    } else {
      admin = await User.create({
        name,
        email,
        password,
        role: "admin",
      });
      console.log("✅ Admin user created successfully.");
    }

    console.log("----------------------------------------");
    console.log("🔑 Admin Credentials:");
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     ${admin.role}`);
    console.log("----------------------------------------");

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error creating admin user: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
