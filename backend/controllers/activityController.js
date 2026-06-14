import Activity from '../models/Activity.js';

// Helper: format a Date into a friendly deadline string
const formatDeadline = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = d - now;
  const diffHrs = diffMs / (1000 * 60 * 60);

  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (sameDay) return `${timeStr} Today`;
  if (isTomorrow) return `Tomorrow ${timeStr}`;
  if (diffHrs < 0) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// Helper: compute "eta" label for urgent items (e.g., "LIVE NOW", "2h left")
const computeEta = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = d - now;
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) return 'LIVE NOW';
  if (diffHrs < 1) return `${Math.round(diffMs / (1000 * 60))}m left`;
  return `${Math.round(diffHrs)}h left`;
};

// @route POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { type, task, room, deadline, timeReq } = req.body;

    if (!type || !task || !deadline) {
      return res.status(400).json({ message: 'type, task, and deadline are required' });
    }

    const activity = await Activity.create({
      user: req.user._id,
      type,
      task,
      room,
      deadline,
      timeReq,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/activities/grouped/:type
// Returns { urgent, left, done } shaped exactly like SECTIONS[type] in the frontend
export const getGroupedActivities = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['classes', 'assignments', 'events', 'attendance', 'notices'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    const now = new Date();
    const urgentWindow = new Date(now.getTime() + 6 * 60 * 60 * 1000); // next 6 hours

    const activities = await Activity.find({ user: req.user._id, type }).sort({ deadline: 1 });

    const urgent = [];
    const left = [];
    const done = [];

    let leftCounter = 1;
    let doneCounter = 1;

    activities.forEach((a) => {
      if (a.status === 'done') {
        done.push({
          sno: doneCounter++,
          _id: a._id,
          task: a.task,
          deadline: formatDeadline(a.deadline),
          timeReq: a.timeReq,
        });
      } else if (a.deadline <= urgentWindow) {
        urgent.push({
          id: a._id,
          task: a.task,
          room: a.room,
          deadline: formatDeadline(a.deadline),
          eta: computeEta(a.deadline),
          timeReq: a.timeReq,
        });
      } else {
        left.push({
          sno: leftCounter++,
          _id: a._id,
          task: a.task,
          deadline: formatDeadline(a.deadline),
          timeReq: a.timeReq,
        });
      }
    });

    res.status(200).json({ urgent, left, done });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/activities
// Returns all raw activities for the logged-in user (optional ?type= filter)
export const getActivities = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const activities = await Activity.find(filter).sort({ deadline: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this activity' });
    }

    const { task, room, deadline, timeReq, status } = req.body;

    activity.task = task ?? activity.task;
    activity.room = room ?? activity.room;
    activity.deadline = deadline ?? activity.deadline;
    activity.timeReq = timeReq ?? activity.timeReq;
    activity.status = status ?? activity.status;

    const updated = await activity.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    await activity.deleteOne();
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};