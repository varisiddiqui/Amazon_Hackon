/** Hostel module — room, mess, complaints, notices, leave */

export const hostelOverview = {
  roomNo: "A-204",
  block: "A Block",
  floor: "2nd Floor",
  warden: "Mr. Sharma",
  wardenPhone: "+91 98765 43210",
  roommates: 2,
};

export const messMenu = {
  breakfast: "Poha + Tea",
  lunch: "Dal Rice + Roti",
  dinner: "Paneer + Rice",
  special: "Paneer Butter Masala",
  timings: { breakfast: "7:30–9:00 AM", lunch: "12:30–2:00 PM", dinner: "7:30–9:00 PM" },
};

export const complaintCategories = [
  "Electricity",
  "Water",
  "Internet",
  "Cleaning",
  "Furniture",
];

export const defaultComplaints = [
  { id: 1, title: "WiFi not working", category: "Internet", status: "pending", date: "Today" },
  { id: 2, title: "Tap leakage in bathroom", category: "Water", status: "in_progress", date: "Yesterday" },
  { id: 3, title: "Broken chair", category: "Furniture", status: "resolved", date: "Jun 10" },
];

export const hostelNotices = [
  {
    id: 1,
    title: "Water supply maintenance",
    date: "Today",
    summary: "Water supply will be interrupted 10 AM–2 PM for pipeline repair.",
  },
  {
    id: 2,
    title: "Mess timing changed",
    date: "Today",
    summary: "Dinner timing extended to 9:30 PM on weekends.",
  },
  {
    id: 3,
    title: "Room inspection tomorrow",
    date: "Tomorrow",
    summary: "Keep rooms clean. Inspection at 11 AM by warden.",
  },
];

export const laundry = {
  collected: 2,
  expectedDelivery: "Tomorrow",
  status: "In Process",
};

export const visitorPasses = [
  { id: 1, name: "Rahul Kumar", date: "Jun 12", time: "4:00 PM", status: "approved" },
  { id: 2, name: "Priya Singh", date: "Jun 14", time: "2:00 PM", status: "pending" },
];

export const leaveRequests = [
  { id: 1, from: "Jun 15", to: "Jun 17", reason: "Family function", status: "pending" },
  { id: 2, from: "Jun 5", to: "Jun 6", reason: "Medical", status: "approved" },
];

export const roommates = [
  { id: 1, name: "Rahul", phone: "+91 98765 11111", course: "CSE 3rd Year" },
  { id: 2, name: "Aman", phone: "+91 98765 22222", course: "CSE 3rd Year" },
];

export const emergencyContacts = [
  { label: "Warden", phone: "+91 98765 43210", icon: "👨‍💼" },
  { label: "Security", phone: "+91 98765 99999", icon: "🛡️" },
  { label: "Medical Center", phone: "+91 98765 88888", icon: "🏥" },
  { label: "Ambulance", phone: "108", icon: "🚑" },
];

export const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export function getHostelSummary() {
  const pendingComplaints = defaultComplaints.filter((c) => c.status === "pending").length;
  return {
    menuSpecial: messMenu.special,
    noticeCount: hostelNotices.length,
    pendingComplaints,
  };
}

export function summarizeHostelNotices() {
  return [
    "Water supply maintenance 10 AM–2 PM today",
    "Mess dinner extended to 9:30 PM on weekends",
    "Room inspection tomorrow at 11 AM",
  ];
}

export function getHostelAIAnswer(question) {
  const q = question.toLowerCase();
  if (/menu|mess|food|breakfast|lunch|dinner/.test(q)) {
    return {
      text: "Today's Mess Menu",
      bullets: [
        `Breakfast: ${messMenu.breakfast}`,
        `Lunch: ${messMenu.lunch}`,
        `Dinner: ${messMenu.dinner}`,
        `✨ Special: ${messMenu.special}`,
      ],
    };
  }
  if (/laundry/.test(q)) {
    return {
      text: `Laundry: ${laundry.collected} items collected. Expected delivery ${laundry.expectedDelivery}.`,
    };
  }
  if (/notice/.test(q)) {
    return { text: "Hostel Notices", bullets: summarizeHostelNotices() };
  }
  if (/complaint|pending/.test(q)) {
    const pending = defaultComplaints.filter((c) => c.status !== "resolved").length;
    return {
      text: `You have ${pending} active complaint(s). WiFi issue is still pending.`,
    };
  }
  return {
    text: "I can help with mess menu, laundry, notices, and complaints. Try asking about today's menu!",
  };
}
