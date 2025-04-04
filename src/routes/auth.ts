import express, {Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users"; 

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("PrettyBio Backend is running 🎉");
});

// Signup
router.post("/signup", async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal server error" });
    return 
  }
});

// Login
router.post("/login", async (req: Request, res: Response):Promise<any> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Setup Page
router.post("/setup", async (req: Request, res: Response):Promise<any> => {
  try {
    const { userId, userImage, name, bio, userLink } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.userImage = userImage;
    user.name = name;
    user.bio = bio;
    user.userLink = userLink;

    await user.save();
    return res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Setup Page Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

