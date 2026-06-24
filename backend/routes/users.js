import express from "express";
import User from "../models/User.js";
import upload from "../config/multer.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Submit Registration Form
router.post("/register", upload.array("images", 10), async (req, res) => {
  try {
    const { 
      fullName, displayName, age, gender, country, city, whatsapp, 
      occupation, education, religion, height, maritalStatus, children, aboutMe,
      goal, preference 
    } = req.body;

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const newUser = new User({
      fullName, displayName, age: age ? Number(age) : undefined, gender, country, city, whatsapp,
      occupation, education, religion, height, maritalStatus, children, aboutMe, goal, preference,
      images: imageUrls
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Profile registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Read profiles (Admin Dashboard Access Only)
router.get("/all", protectAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. AI Match Algorithm Engine
router.get("/match/:id", protectAdmin, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User profile not found." });

    // Filter rules: Must be paid members, different IDs, opposite gender
    const candidates = await User.find({
      _id: { $ne: targetUser._id },
      paymentStatus: "Paid",
      gender: targetUser.gender === "Male" ? "Female" : "Male"
    });

    let scoredMatches = candidates.map(candidate => {
      let score = 0;

      // Rule A: Country/City matches
      if (candidate.country === targetUser.country) score += 35;
      if (candidate.city === targetUser.city) score += 15;

      // Rule B: Matching relationship criteria target words
      if (targetUser.goal && candidate.goal && targetUser.goal.toLowerCase().includes(candidate.goal.toLowerCase())) score += 20;

      // Rule C: Text preferences analysis cross references
      if (targetUser.preference && candidate.aboutMe) {
        const words = candidate.aboutMe.toLowerCase().split(/\s+/);
        if (words.some(word => word.length > 3 && targetUser.preference.toLowerCase().includes(word))) {
          score += 20;
        }
      }

      // Rule D: Age proximity scale
      const ageDiff = Math.abs(targetUser.age - candidate.age);
      if (ageDiff <= 5) score += 10;

      return { user: candidate, matchScore: Math.min(score, 100) };
    });

    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    res.status(200).json(scoredMatches);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;