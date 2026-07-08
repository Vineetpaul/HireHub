const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["jobSeeker", "employer"] },
    avatar: String,
    resume: String,

    // schema for employer
    companyName: String,
    companyDescription: String,
    companyLogo: String,
}, { timestamps: true });

// Encrypting the password brfore saving

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

// comparing the password

userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);