/** Placement Hub — career copilot data */

export const readiness = {
  score: 78,
  label: "Good Progress",
  resumeScore: 82,
  applications: 12,
  interviewsScheduled: 2,
  offersReceived: 0,
  nextInterview: { company: "Amazon", daysLeft: 5 },
};

export const resumeAnalysis = {
  score: 82,
  strengths: ["Projects", "Technical Skills", "Education"],
  improvements: ["Add metrics to projects", "Improve professional summary", "Add achievements & certifications"],
};

export const companies = ["Amazon", "Google", "Microsoft", "TCS", "Infosys"];

export const interviewQuestions = {
  Amazon: [
    "Tell me about yourself.",
    "Why Amazon?",
    "Describe a challenge you solved.",
    "Design a scalable notification system.",
  ],
  Google: [
    "Tell me about yourself.",
    "Why Google?",
    "Explain a complex project you built.",
    "How do you handle ambiguity?",
  ],
  Microsoft: [
    "Tell me about yourself.",
    "Why Microsoft?",
    "Describe teamwork experience.",
    "Explain OOP principles with examples.",
  ],
  TCS: [
    "Tell me about yourself.",
    "Why TCS?",
    "Explain DBMS normalization.",
    "Strengths and weaknesses?",
  ],
  Infosys: [
    "Tell me about yourself.",
    "Why Infosys?",
    "Explain your final year project.",
    "Are you willing to relocate?",
  ],
};

export const codingProgress = [
  { topic: "Arrays", percent: 90 },
  { topic: "Strings", percent: 75 },
  { topic: "Trees", percent: 40 },
  { topic: "Graphs", percent: 20 },
];

export const aptitudeSections = [
  { name: "Quantitative", icon: "🔢" },
  { name: "Logical", icon: "🧩" },
  { name: "Verbal", icon: "📖" },
  { name: "Reasoning", icon: "💡" },
];

export const companyRoadmaps = {
  Amazon: [
    { week: "Week 1", topic: "Arrays", detail: "Two pointers, sliding window, prefix sum" },
    { week: "Week 2", topic: "Trees", detail: "BST, traversals, LCA" },
    { week: "Week 3", topic: "Graphs", detail: "BFS, DFS, shortest path" },
    { week: "Week 4", topic: "System Design", detail: "Scalability, caching, load balancing" },
  ],
  Google: [
    { week: "Week 1", topic: "Arrays & Hashing", detail: "Maps, sets, frequency counting" },
    { week: "Week 2", topic: "DP", detail: "Memoization, tabulation" },
    { week: "Week 3", topic: "Graphs", detail: "Union-find, topological sort" },
    { week: "Week 4", topic: "System Design", detail: "Google-scale architecture" },
  ],
};

export const jobOpportunities = [
  { company: "Amazon", role: "SDE Intern", deadline: "Jun 18", type: "intern" },
  { company: "Microsoft", role: "Software Internship", deadline: "Jun 22", type: "intern" },
  { company: "Google", role: "Summer Program", deadline: "Jun 25", type: "intern" },
  { company: "TCS", role: "Digital Hire", deadline: "Jun 30", type: "fulltime" },
];

export const placementCalendar = [
  { company: "Amazon", date: "15 June", type: "Interview" },
  { company: "Microsoft", date: "20 June", type: "Drive" },
  { company: "Infosys", date: "24 June", type: "Drive" },
];

export const skillGap = {
  target: "Amazon SDE",
  missing: ["System Design", "Dynamic Programming", "Behavioral Preparation"],
};

export const mockInterviewFeedback = {
  confidence: 8,
  communication: 7,
  improve: "Speak more concisely. Structure answers using STAR format.",
};

export const AI_CAREER_QUESTIONS = [
  "How do I prepare for Amazon?",
  "Review my resume",
  "Give me SQL interview questions",
  "What should I learn next?",
  "Prepare me for Amazon SDE",
];

export function analyzeResumeUpload() {
  return { ...resumeAnalysis, score: 82 };
}

export function getCompanyRoadmap(company) {
  return companyRoadmaps[company] || companyRoadmaps.Amazon;
}

export function getPlacementAIAnswer(question) {
  const q = question.toLowerCase();

  if (/resume|review my/.test(q)) {
    return {
      type: "resume",
      text: "Resume Analysis",
      score: resumeAnalysis.score,
      strengths: resumeAnalysis.strengths,
      improvements: resumeAnalysis.improvements,
    };
  }

  if (/sql/.test(q)) {
    return {
      text: "SQL Interview Questions",
      bullets: [
        "Explain INNER vs LEFT JOIN",
        "What is indexing and when to use it?",
        "Write a query for 2nd highest salary",
        "Explain ACID properties",
        "Difference between WHERE and HAVING",
      ],
    };
  }

  if (/learn next|what should/.test(q)) {
    return {
      text: "Based on your profile, focus on:",
      bullets: skillGap.missing.map((s) => s),
      recommendation: "Start with System Design basics — scalability patterns for Amazon SDE.",
    };
  }

  if (/amazon|prepare/.test(q)) {
    return {
      text: "Amazon SDE Preparation Roadmap",
      phases: companyRoadmaps.Amazon.map((r) => ({
        days: r.week,
        subject: r.topic,
        topics: r.detail,
      })),
    };
  }

  return {
    text: `Your placement readiness is **${readiness.score}%**. Resume score: **${readiness.resumeScore}%**. Next interview: **${readiness.nextInterview.company}** in ${readiness.nextInterview.daysLeft} days.`,
  };
}
