/** Transport module — bus schedule, routes, tracking, AI assistant */

export const busOverview = {
  busNo: "12",
  route: "North Campus",
  driver: "Rajesh Kumar",
  driverPhone: "+91 98765 55555",
  status: "on_time",
  statusLabel: "On Time",
  assignedSeat: "Seat 14",
};

export const todaySchedule = {
  morning: { time: "7:30 AM", status: "completed", label: "Morning Pickup" },
  evening: { time: "5:00 PM", status: "upcoming", label: "Evening Drop" },
};

export const liveTracking = {
  distanceAway: "2 km",
  etaMinutes: 8,
  currentLocation: "Near City Center",
  lat: 28.6139,
  lng: 77.209,
  progress: 72,
};

export const routeStops = [
  { id: 1, name: "Main Gate", time: "7:30 AM", active: false },
  { id: 2, name: "City Center", time: "7:45 AM", active: true },
  { id: 3, name: "Railway Station", time: "8:00 AM", active: false },
  { id: 4, name: "Campus", time: "8:15 AM", active: false },
];

export const busAlerts = [
  {
    id: 1,
    type: "delay",
    title: "Bus Delayed",
    message: "15 minutes delay due to traffic on NH-48",
    urgent: true,
  },
];

export const transportNotices = [
  {
    id: 1,
    title: "Route Changed",
    date: "Today",
    summary: "Bus 12 will skip Railway Station stop until Jun 18 due to road work.",
  },
  {
    id: 2,
    title: "Holiday Schedule",
    date: "Jun 20",
    summary: "No evening service on Eid. Morning pickup at 8:00 AM only.",
  },
  {
    id: 3,
    title: "Maintenance Notice",
    date: "Jun 22",
    summary: "Fleet inspection — expect 10 min delays on all North Campus routes.",
  },
];

export const seatAvailability = {
  total: 40,
  remaining: 12,
};

export const missedBusAlternatives = {
  nextBus: { time: "9:00 AM", busNo: "12" },
  distance: "2.1 km",
  etaMinutes: 15,
  suggestion: "Walk to City Center stop or take auto to Campus Main Gate.",
};

export const emergencyContacts = [
  { label: "Driver", phone: "+91 98765 55555", icon: "🚌" },
  { label: "Transport Office", phone: "+91 98765 66666", icon: "🏢" },
  { label: "Security", phone: "+91 98765 99999", icon: "🛡️" },
];

export const AI_TRANSPORT_QUESTIONS = [
  "Where is my bus?",
  "When will it arrive?",
  "Any delays today?",
  "What's my route?",
  "I missed my bus",
];

export function getTransportAIAnswer(question) {
  const q = question.toLowerCase();

  if (/missed/.test(q)) {
    return {
      type: "missed",
      text: "Alternative Options — You missed the bus",
      items: [
        { title: "Next Bus", subtitle: `${missedBusAlternatives.nextBus.time} · Bus ${missedBusAlternatives.nextBus.busNo}` },
        { title: "Nearest Stop Distance", subtitle: missedBusAlternatives.distance },
        { title: "Estimated Arrival", subtitle: `${missedBusAlternatives.etaMinutes} minutes` },
      ],
      footer: missedBusAlternatives.suggestion,
    };
  }

  if (/where|location/.test(q)) {
    return {
      text: `Bus ${busOverview.busNo} is currently **${liveTracking.currentLocation}**, **${liveTracking.distanceAway}** away from you.`,
      eta: `Expected arrival in **${liveTracking.etaMinutes} minutes**.`,
    };
  }

  if (/when|arrive|eta/.test(q)) {
    return {
      text: `Bus ${busOverview.busNo} will arrive in **${liveTracking.etaMinutes} minutes**.`,
      eta: `Current status: **${busOverview.statusLabel}** · Evening pickup at **${todaySchedule.evening.time}**.`,
    };
  }

  if (/delay/.test(q)) {
    return {
      text: "Today's Transport Alerts",
      bullets: [
        busAlerts[0].message,
        "Evening service on schedule unless notified",
      ],
    };
  }

  if (/route|stop/.test(q)) {
    return {
      text: `Your route: **${busOverview.route}** (Bus ${busOverview.busNo})`,
      bullets: routeStops.map((s) => `${s.name} — ${s.time}`),
    };
  }

  return {
    text: `Bus **${busOverview.busNo}** on **${busOverview.route}** route is **${liveTracking.distanceAway}** away. ETA: **${liveTracking.etaMinutes} min**.`,
  };
}
