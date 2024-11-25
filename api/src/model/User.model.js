import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false,
    },
    f_name: {
        type: String,
        required: true,
    },
    f_username: {
        type: String,
        required: false,
    },
    f_email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    f_mobile: {
        type: String,
        required: false,
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    f_designation: {
        type: String,
        required: false,
    },
    f_gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false,
    },
    f_course: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [false, "Password is required"],
        default:"12345678",
        minlength: 6,
    },
    role: { 
        type: String,
        enum: ["user", "admin"],
        default: "user" },
}, { timestamps: true });

// Pre-save hook to hash password before saving it
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = mongoose.model("User", userSchema);
