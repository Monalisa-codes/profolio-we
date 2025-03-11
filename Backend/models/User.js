const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

// Create model
const UserModel = mongoose.model("User", userSchema);

// 🔹 Function to find users by field
async function findBy(filter) {
  return await UserModel.findOne(filter);
}

// 🔹 Function to add a new user
async function add(user) {
  return await UserModel.create(user);
}

// ✅ Correct Export
module.exports = { UserModel, findBy, add };
