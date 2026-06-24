import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST: Verify and unlock premium profile status
router.post("/verify-payment", async (req, res) => {
  try {
    const { userId, referenceId } = req.body;
    if (!userId || !referenceId) {
      return res.status(400).json({ success: false, message: "Missing tracking keys." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { paymentStatus: "Paid", referenceId: referenceId },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Premium tier unlocked successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;