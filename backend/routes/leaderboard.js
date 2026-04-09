const express = require("express");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");
const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const router = express.Router();

// GET /api/leaderboard/students — student leaderboard
router.get("/students", auth, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("_id name email");

    const leaderboard = await Promise.all(
      students.map(async (s) => {
        const eventsAttended = await EventRegistration.countDocuments({
          student: s._id,
          status: "attended",
        });
        const feedbackGiven = await Feedback.countDocuments({ student: s._id });

        // Count photos: events where the student attended and that have photos
        const attendedRegs = await EventRegistration.find({
          student: s._id,
          status: "attended",
        }).select("event");
        const eventIds = attendedRegs.map((r) => r.event);
        const eventsWithPhotos = await Event.countDocuments({
          _id: { $in: eventIds },
          photos: { $exists: true, $not: { $size: 0 } },
        });

        const score = eventsAttended * 3 + feedbackGiven * 2 + eventsWithPhotos * 1;

        return {
          _id: s._id,
          name: s.name,
          email: s.email,
          eventsAttended,
          feedbackGiven,
          photosContributed: eventsWithPhotos,
          score,
        };
      })
    );

    leaderboard.sort((a, b) => b.score - a.score);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
