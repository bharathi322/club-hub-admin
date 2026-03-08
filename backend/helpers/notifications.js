const Notification = require("../models/Notification");
const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");

/**
 * Notify all students about a new event being created.
 */
async function notifyNewEvent(event) {
  try {
    const students = await User.find({ role: "student" }).select("_id");
    const notifications = students.map((s) => ({
      user: s._id,
      title: "New Event Posted",
      description: `"${event.name}" by ${event.club} on ${event.date}`,
      type: "info",
      relatedEvent: event._id,
    }));
    if (notifications.length) await Notification.insertMany(notifications);
  } catch (err) {
    console.error("notifyNewEvent error:", err.message);
  }
}

/**
 * Notify registered students when an event status changes.
 */
async function notifyEventStatusChange(event, oldStatus) {
  try {
    const regs = await EventRegistration.find({ event: event._id }).select("student");
    const typeMap = { approved: "success", pending: "warning", warning: "warning" };
    const notifications = regs.map((r) => ({
      user: r.student,
      title: "Event Status Updated",
      description: `"${event.name}" changed from ${oldStatus} to ${event.status}`,
      type: typeMap[event.status] || "info",
      relatedEvent: event._id,
    }));
    if (notifications.length) await Notification.insertMany(notifications);
  } catch (err) {
    console.error("notifyEventStatusChange error:", err.message);
  }
}

module.exports = { notifyNewEvent, notifyEventStatusChange };
