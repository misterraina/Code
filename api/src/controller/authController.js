import { User } from "../model/User.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


//Register User
export const registerUser = async (req, res) => {
    const { f_name, f_email, f_mobile, f_designation, f_gender, password } = req.body;

    if (!f_name || !f_email || !f_mobile || !f_designation || !f_gender ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if user already exists by email
        const existUser = await User.findOne({ f_email });
        if (existUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create a new user
        const newUser = await User.create({
            f_name,
            // f_username,
            f_email,
            f_mobile,
            f_designation,
            f_gender,
            password,
        });

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};


//Admin Register by backend only
export const registerAdmin = async (req, res) => {
    const { f_name, f_email, f_username, password } = req.body;

    // Validate required fields
    if (!f_name || !f_email || !f_username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if an admin already exists with the same email
        const existAdmin = await User.findOne({ f_email });
        if (existAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        // Create admin user with 'admin' role
        const newAdmin = await User.create({
            f_name,
            f_email,
            f_username,
            password,
            role: "admin",
        });

        res.status(201).json({ message: "Admin registered successfully", adminId: newAdmin._id });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
};


// Login
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Ensure both fields are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        // Find user by email and username
        const user = await User.findOne({ 
            $or:[
                {f_email: username},
                {f_username: username}
            ]
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {userId: user._id, role: user.role },
            process.env.JWT_SECRET, {
            expiresIn: '1d', 
        });

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.f_username,
                designation: user.f_designation,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const authStatus = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ userId: decoded.userId, role: decoded.role });
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};




//admin user

// Create User (admin-only action or any authorized user)
export const createUser = async (req, res) => {
    const { f_name, f_email, f_username, f_mobile, f_designation, f_gender, password } = req.body;

    if (!f_name || !f_username || !f_email || !f_mobile || !f_designation || !f_gender || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existUser = await User.findOne({ f_email });
        if (existUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = await User.create({
            f_name,
            f_username,
            f_email,
            f_mobile,
            f_designation,
            f_gender,
            password,
        });

        res.status(201).json({ message: "User created successfully", userId: newUser._id });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Edit User
export const editUser = async (req, res) => {
    const { userId } = req.params;  // Get user ID from URL params
    const { f_name, f_email, f_username, f_mobile, f_designation, f_gender, password } = req.body;

    if (!f_name || !f_username || !f_email || !f_mobile || !f_designation || !f_gender || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        user.f_name = f_name;
        user.f_email = f_email;
        user.f_username = f_username;
        user.f_mobile = f_mobile;
        user.f_designation = f_designation;
        user.f_gender = f_gender;
        user.password = password;  // Ideally, hash the new password before saving

        await user.save();

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    const { userId } = req.params;  // Get user ID from URL params

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        // Assuming you're using a User model and that the 'User.find()' function fetches all users
        const users = await User.find(); 

        // Send all users in response
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

