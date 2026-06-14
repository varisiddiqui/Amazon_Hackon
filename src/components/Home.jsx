import { useState, useRef, useEffect } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// Trending 2025: deep navy base + electric violet + neon mint + coral pop
const THEME = {
  bg:       "#080B14",
  surface:  "#0E1220",
  card:     "#131929",
  border:   "#1C2440",
  border2:  "#242B45",
  text:     "#E4E8FF",
  muted:    "#5A6080",
  muted2:   "#8890B0",
  violet:   "#7B61FF",
  violetGl: "#7B61FF40",
  mint:     "#00E5BF",
  mintGl:   "#00E5BF30",
  coral:    "#FF5E7D",
  coralGl:  "#FF5E7D30",
  amber:    "#FFAB40",
  amberGl:  "#FFAB4030",
  sky:      "#38BDF8",
  skyGl:    "#38BDF830",
  rose:     "#F472B6",
  roseGl:   "#F472B630",
};

const SECTION_COLOR = {
  home:        { a: THEME.violet, gl: THEME.violetGl },
  classes:     { a: THEME.mint,   gl: THEME.mintGl   },
  assignments: { a: THEME.coral,  gl: THEME.coralGl  },
  events:      { a: THEME.amber,  gl: THEME.amberGl  },
  attendance:  { a: THEME.sky,    gl: THEME.skyGl    },
  notices:     { a: THEME.rose,   gl: THEME.roseGl   },
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",        icon: "◈",  label: "Dashboard"   },
  { id: "classes",     icon: "⬡",  label: "Classes"     },
  { id: "assignments", icon: "◎",  label: "Assignments" },
  { id: "events",      icon: "◇",  label: "Events"      },
  { id: "attendance",  icon: "◉",  label: "Attendance"  },
  { id: "notices",     icon: "◆",  label: "Notices"     },
];

const SECTIONS = {
  classes: {
    accent: THEME.mint,
    urgent: [
      { id:1, task:"Advanced Algorithms",   room:"Room 204 · Block A", deadline:"09:00 AM",      eta:"LIVE NOW",  timeReq:"1h 30m" },
      { id:2, task:"DBMS Lab Practical",    room:"Lab 3 · Ground Flr", deadline:"11:00 AM",      eta:"2h left",   timeReq:"2h"     },
      { id:3, task:"OS Tutorial",           room:"Room 108 · Block B", deadline:"01:00 PM",      eta:"4h left",   timeReq:"30m"    },
    ],
    left: [
      { sno:1, task:"Machine Learning Lec",  deadline:"03:00 PM",       timeReq:"1h"     },
      { sno:2, task:"Computer Networks Lab", deadline:"05:00 PM",       timeReq:"2h"     },
      { sno:3, task:"Compiler Design Class", deadline:"Tomorrow 9AM",   timeReq:"1h 30m" },
      { sno:4, task:"Software Engg Workshop",deadline:"Tomorrow 2PM",   timeReq:"3h"     },
    ],
    done: [
      { sno:1, task:"Data Structures Lec",   deadline:"08:00 AM",       timeReq:"1h"  },
      { sno:2, task:"Maths Tutorial",        deadline:"Yesterday",      timeReq:"1h"  },
    ],
  },
  assignments: {
    accent: THEME.coral,
    urgent: [
      { id:1, task:"ML — Neural Nets Report",  room:"Upload Portal",  deadline:"11:59 PM Today", eta:"DUE TODAY", timeReq:"3h"     },
      { id:2, task:"DBMS ER Diagram",          room:"Prof. Sharma",   deadline:"Tomorrow 8AM",   eta:"14h left",  timeReq:"1h 30m" },
      { id:3, task:"OS Memory Management",     room:"Email Submit",   deadline:"Tomorrow 10AM",  eta:"16h left",  timeReq:"2h"     },
    ],
    left: [
      { sno:1, task:"Compiler Mini Project",  deadline:"Jun 20",  timeReq:"8h"  },
      { sno:2, task:"CN Socket Programming",  deadline:"Jun 21",  timeReq:"4h"  },
      { sno:3, task:"Maths Problem Set 7",    deadline:"Jun 22",  timeReq:"2h"  },
    ],
    done: [
      { sno:1, task:"SE UML Diagrams",         deadline:"Jun 10",  timeReq:"3h"     },
      { sno:2, task:"DS Linked List Impl.",    deadline:"Jun 8",   timeReq:"2h"     },
      { sno:3, task:"AI Search Algorithms",   deadline:"Jun 5",   timeReq:"4h"     },
    ],
  },
  events: {
    accent: THEME.amber,
    urgent: [
      { id:1, task:"Hackathon Registration",  room:"Google Form",    deadline:"06:00 PM Today", eta:"URGENT",   timeReq:"10m"    },
      { id:2, task:"Coding Club Meet",        room:"Seminar Hall 2", deadline:"07:00 PM Today", eta:"6h left",  timeReq:"1h 30m" },
      { id:3, task:"Cultural Fest Volunteer", room:"Online Form",    deadline:"Tomorrow 12PM",  eta:"18h left", timeReq:"15m"    },
    ],
    left: [
      { sno:1, task:"TechFest 2025 Day 1",   deadline:"Jun 18",  timeReq:"Full Day" },
      { sno:2, task:"Alumni Talk Series",    deadline:"Jun 20",  timeReq:"2h"       },
      { sno:3, task:"Sports Day Reg.",       deadline:"Jun 15",  timeReq:"15m"      },
    ],
    done: [
      { sno:1, task:"Freshers Night",        deadline:"Jun 1",   timeReq:"3h"  },
      { sno:2, task:"IEEE Workshop",         deadline:"Jun 5",   timeReq:"4h"  },
    ],
  },
  attendance: {
    accent: THEME.sky,
    urgent: [
      { id:1, task:"Mark Attendance — Algo",  room:"Room 204",  deadline:"09:15 AM", eta:"MARK NOW", timeReq:"1m"  },
      { id:2, task:"DBMS Lab Biometric",      room:"Lab 3",     deadline:"11:05 AM", eta:"2h left",  timeReq:"1m"  },
      { id:3, task:"OS Tutorial Sign-in",     room:"Room 108",  deadline:"01:05 PM", eta:"4h left",  timeReq:"1m"  },
    ],
    left: [
      { sno:1, task:"ML Lecture Attendance", deadline:"03:05 PM", timeReq:"1m" },
      { sno:2, task:"CN Lab Sign-in",        deadline:"05:05 PM", timeReq:"1m" },
    ],
    done: [
      { sno:1, task:"DS Lecture",             deadline:"08:05 AM", timeReq:"1m" },
      { sno:2, task:"Maths Tutorial",         deadline:"Yesterday", timeReq:"1m" },
    ],
  },
  notices: {
    accent: THEME.rose,
    urgent: [
      { id:1, task:"Hostel Mess Fee Due",       room:"Hostel Office", deadline:"08:00 PM Today", eta:"TODAY",    timeReq:"10m" },
      { id:2, task:"Library Fine Clearance",    room:"Library",       deadline:"06:00 PM Today", eta:"5h left",  timeReq:"15m" },
      { id:3, task:"Scholarship Form Deadline", room:"Admin Block",   deadline:"Tomorrow 5PM",   eta:"20h left", timeReq:"30m" },
    ],
    left: [
      { sno:1, task:"Room Maintenance Request",   deadline:"Jun 15",  timeReq:"10m" },
      { sno:2, task:"Hostel Leave Application",   deadline:"Jun 17",  timeReq:"15m" },
      { sno:3, task:"NOC for Internship",         deadline:"Jun 18",  timeReq:"20m" },
    ],
    done: [
      { sno:1, task:"Electricity Bill — May",     deadline:"Jun 1",   timeReq:"5m"  },
      { sno:2, task:"Mess Menu Feedback",         deadline:"Jun 3",   timeReq:"5m"  },
    ],
  },
};

const HOME_QUICK = [
  { icon:"📚", label:"Classes",    count:"4 today",   color: THEME.mint,  id:"classes"     },
  { icon:"✏️", label:"Assignments",count:"3 due",     color: THEME.coral, id:"assignments" },
  { icon:"🎉", label:"Events",     count:"2 today",   color: THEME.amber, id:"events"      },
  { icon:"✅", label:"Attendance", count:"2 pending", color: THEME.sky,   id:"attendance"  },
  { icon:"📋", label:"Notices",    count:"3 urgent",  color: THEME.rose,  id:"notices"     },
  { icon:"💼", label:"Placement",  count:"Resume due",color: THEME.violet,id:"home"        },
];

const AI_FEED = [
  { icon:"🔥", text:"ML Assignment due tonight 11:59 PM — ~3h needed. Start now.",      dot: THEME.coral  },
  { icon:"📍", text:"Google Resume deadline in 5h. Your v3 draft was saved Jun 12.",     dot: THEME.coral  },
  { icon:"📅", text:"Algorithms lecture in 20 min — Room 204, Block A. Don't be late.", dot: THEME.amber  },
  { icon:"🏆", text:"Hackathon closes at 6 PM. 3 friends already registered.",           dot: THEME.amber  },
  { icon:"💳", text:"Mess fee payment due 8 PM. Pay via hostel portal now.",             dot: THEME.muted  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function glow(color, spread = 12) {
  return `0 0 ${spread}px ${color}`;
}

// ─── AI CHAT ─────────────────────────────────────────────────────────────────
function AIChat({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ role:"ai", text:"Hey Rahul 👋 I'm your campus AI. Ask me anything — schedules, deadlines, exam tips, or what to focus on right now." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput(""); setLoading(true);
    setMsgs(m => [...m, { role:"user", text:q }]);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          system:"You are a smart, friendly campus AI assistant for an Indian engineering college student named Rahul Sharma (CSE, 3rd Year). You help with class schedules, assignment deadlines, events, placement prep, attendance, hostel notices, and general student life. Be concise (2-4 sentences max), warm, practical, and use occasional emojis. Speak like a helpful senior student.",
          messages:[{ role:"user", content:q }],
        }),
      });
      const d = await r.json();
      const reply = d.content?.find(b => b.type==="text")?.text || "Couldn't reach the server right now!";
      setMsgs(m => [...m, { role:"ai", text:reply }]);
    } catch { setMsgs(m => [...m, { role:"ai", text:"Hmm, something went wrong. Try again!" }]); }
    setLoading(false);
  }

  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"flex-start", pointerEvents:"none" }}>
      {/* backdrop */}
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"#00000080", pointerEvents:"all" }} />
      <div style={{
        position:"relative", pointerEvents:"all",
        width: 340, height:"72vh", margin:"0 0 20px 20px",
        background: THEME.surface,
        border:`1px solid ${THEME.violet}50`,
        borderRadius:20,
        boxShadow:`0 0 60px ${THEME.violet}30, 0 24px 48px #00000080`,
        display:"flex", flexDirection:"column", overflow:"hidden",
      }}>
        {/* header */}
        <div style={{ padding:"14px 16px", background:`linear-gradient(135deg, ${THEME.violet}20, ${THEME.mint}10)`, borderBottom:`1px solid ${THEME.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${THEME.violet}, ${THEME.mint})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow: glow(THEME.violet) }}>🤖</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:THEME.text }}>Campus AI</div>
            <div style={{ fontSize:10, color:THEME.mint, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:THEME.mint, display:"inline-block" }}></span> Online
            </div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:THEME.muted, fontSize:18, cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>
        {/* messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10, scrollbarWidth:"none" }}>
          {msgs.map((m,i) => (
            <div key={i} style={{
              alignSelf: m.role==="user" ? "flex-end" : "flex-start",
              maxWidth:"82%",
              background: m.role==="user"
                ? `linear-gradient(135deg, ${THEME.violet}, #5B41FF)`
                : THEME.card,
              border: m.role==="ai" ? `1px solid ${THEME.border2}` : "none",
              borderRadius: m.role==="user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              padding:"10px 13px", fontSize:13, lineHeight:1.6,
              color: m.role==="user" ? "#fff" : THEME.text,
            }}>{m.text}</div>
          ))}
          {loading && (
            <div style={{ alignSelf:"flex-start", background:THEME.card, border:`1px solid ${THEME.border2}`, borderRadius:"4px 16px 16px 16px", padding:"10px 16px" }}>
              <span style={{ display:"inline-flex", gap:4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:THEME.violet, animation:`pulse ${0.6+i*0.2}s infinite alternate` }}></span>)}
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* input */}
        <div style={{ padding:"10px 12px 14px", borderTop:`1px solid ${THEME.border}`, display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask anything…"
            style={{ flex:1, background:THEME.card, border:`1px solid ${THEME.border2}`, borderRadius:12, padding:"9px 13px", color:THEME.text, fontSize:13, outline:"none", fontFamily:"inherit" }} />
          <button onClick={send} style={{ background:`linear-gradient(135deg, ${THEME.violet}, #5B41FF)`, border:"none", borderRadius:12, width:38, cursor:"pointer", color:"#fff", fontSize:16, boxShadow: glow(THEME.violet, 8) }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── URGENT CARD ─────────────────────────────────────────────────────────────
function UrgentCard({ item, accent }) {
  const isLive = item.eta.includes("NOW") || item.eta.includes("TODAY") || item.eta.includes("URGENT") || item.eta.includes("MARK");
  return (
    <div style={{
      background:`linear-gradient(135deg, ${accent}12, ${accent}06)`,
      border:`1px solid ${accent}35`,
      borderRadius:14,
      padding:"13px 15px",
      display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      position:"relative", overflow:"hidden",
    }}>
      {/* left strip */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background: accent, borderRadius:"3px 0 0 3px", boxShadow: glow(accent, 6) }} />
      <div style={{ paddingLeft:6 }}>
        <div style={{ fontSize:13, fontWeight:600, color:THEME.text, marginBottom:4 }}>{item.task}</div>
        <div style={{ fontSize:11, color:THEME.muted2 }}>
          {item.room && <span>{item.room} · </span>}
          <span>⏰ {item.deadline}</span>
          <span style={{ marginLeft:8 }}>🕐 {item.timeReq}</span>
        </div>
      </div>
      <div style={{
        fontSize:9, fontWeight:800, letterSpacing:"0.1em",
        color: accent, background:`${accent}20`,
        border:`1px solid ${accent}40`,
        padding:"3px 8px", borderRadius:6, textTransform:"uppercase",
        flexShrink:0, marginLeft:8,
        boxShadow: isLive ? glow(accent, 6) : "none",
      }}>{item.eta}</div>
    </div>
  );
}

// ─── TASK TABLE ──────────────────────────────────────────────────────────────
function TaskTable({ rows, done, accent }) {
  if (!rows.length) return (
    <div style={{ textAlign:"center", color:THEME.muted, padding:"28px 0", fontSize:13 }}>
      {done ? "🎉 Nothing completed yet" : "✅ All clear!"}
    </div>
  );
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            {["#","Task","Deadline","Time Req.",""].map((h,i) => (
              <th key={i} style={{ fontSize:9, fontWeight:700, color:THEME.muted, letterSpacing:"0.1em", textTransform:"uppercase", padding:"6px 8px", textAlign:"left", borderBottom:`1px solid ${THEME.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${THEME.border}20` }}>
              <td style={{ padding:"10px 8px", fontSize:10, color:THEME.muted, fontWeight:700 }}>{r.sno}</td>
              <td style={{ padding:"10px 8px", fontSize:12, color: done ? THEME.muted : THEME.text, textDecoration: done?"line-through":"none", maxWidth:140 }}>{r.task}</td>
              <td style={{ padding:"10px 8px", fontSize:11, color:THEME.muted2, whiteSpace:"nowrap" }}>{r.deadline}</td>
              <td style={{ padding:"10px 8px", fontSize:11, color:THEME.muted2, whiteSpace:"nowrap" }}>{r.timeReq}</td>
              <td style={{ padding:"10px 8px" }}>
                {done
                  ? <span style={{ color:THEME.mint, fontSize:14 }}>✓</span>
                  : <span style={{ display:"block", width:7, height:7, borderRadius:"50%", background:accent, boxShadow: glow(accent, 4), margin:"auto" }}></span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SECTION VIEW ────────────────────────────────────────────────────────────
function SectionView({ id }) {
  const [tab, setTab] = useState("left");
  const data = SECTIONS[id];
  const { accent, urgent, left, done } = data;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, height:"100%" }}>
      {/* SUMMARY PANEL */}
      <div style={{ background:THEME.card, border:`1px solid ${THEME.border}`, borderRadius:18, padding:18, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:accent, boxShadow: glow(accent) }} />
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", color:accent, textTransform:"uppercase" }}>🔥 Urgent — Act Now</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {urgent.map(item => <UrgentCard key={item.id} item={item} accent={accent} />)}
        </div>
      </div>

      {/* TASK LIST PANEL */}
      <div style={{ background:THEME.card, border:`1px solid ${THEME.border}`, borderRadius:18, padding:18, flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
        {/* inner tabs */}
        <div style={{ display:"flex", background:THEME.surface, borderRadius:10, padding:3, marginBottom:14, gap:3 }}>
          {[
            { key:"left",  label:`Pending (${left.length})`  },
            { key:"done",  label:`Completed (${done.length})` },
          ].map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              flex:1, padding:"7px 0", borderRadius:8, border:"none",
              background: tab===t.key ? `linear-gradient(135deg, ${accent}30, ${accent}18)` : "transparent",
              color: tab===t.key ? accent : THEME.muted,
              fontSize:11, fontWeight:700, cursor:"pointer",
              boxShadow: tab===t.key ? `inset 0 0 0 1px ${accent}40` : "none",
              transition:"all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
          <TaskTable rows={tab==="left" ? left : done} done={tab==="done"} accent={accent} />
        </div>
      </div>
    </div>
  );
}

// ─── HOME VIEW ───────────────────────────────────────────────────────────────
function HomeView({ navigate }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* greeting hero */}
      <div style={{
        background:`linear-gradient(135deg, ${THEME.violet}20, ${THEME.mint}10)`,
        border:`1px solid ${THEME.border}`,
        borderRadius:18, padding:20, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:`${THEME.violet}15`, filter:"blur(30px)" }} />
        <div style={{ position:"absolute", bottom:-30, left:60, width:80, height:80, borderRadius:"50%", background:`${THEME.mint}10`, filter:"blur(24px)" }} />
        <div style={{ fontSize:11, color:THEME.muted2, marginBottom:3 }}>☀️ Good Morning</div>
        <div style={{ fontSize:22, fontWeight:800, color:THEME.text, letterSpacing:"-0.02em" }}>Rahul Sharma</div>
        <div style={{ fontSize:11, color:THEME.muted, marginTop:3 }}>CSE · 3rd Year · Roll: 21CS045</div>
        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          {[
            { val:"82%", label:"Attendance", color:THEME.mint },
            { val:"6.7",  label:"CGPA",       color:THEME.violet },
            { val:"12d",  label:"To Exams",   color:THEME.coral },
          ].map(s => (
            <div key={s.label} style={{ background:`${s.color}15`, border:`1px solid ${s.color}30`, borderRadius:10, padding:"8px 12px", textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:9, color:THEME.muted, marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* quick nav grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {HOME_QUICK.map(q => (
          <button key={q.id} onClick={()=>navigate(q.id)} style={{
            background:THEME.card, border:`1px solid ${q.color}25`,
            borderRadius:14, padding:"13px 10px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            cursor:"pointer", transition:"all 0.15s",
          }}>
            <span style={{ fontSize:22 }}>{q.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, color:THEME.text }}>{q.label}</span>
            <span style={{ fontSize:9, color:q.color, background:`${q.color}18`, padding:"2px 7px", borderRadius:8 }}>{q.count}</span>
          </button>
        ))}
      </div>

      {/* AI Feed */}
      <div style={{ background:THEME.card, border:`1px solid ${THEME.border}`, borderRadius:18, padding:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${THEME.violet}, ${THEME.mint})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:THEME.text }}>AI Daily Digest</div>
            <div style={{ fontSize:9, color:THEME.muted }}>Updated just now</div>
          </div>
          <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:THEME.mint, boxShadow: glow(THEME.mint, 4) }} />
        </div>
        {AI_FEED.map((f,i) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"9px 0", borderTop: i>0 ? `1px solid ${THEME.border}` : "none" }}>
            <span style={{ fontSize:15, flexShrink:0 }}>{f.icon}</span>
            <div style={{ display:"flex", alignItems:"flex-start", gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:f.dot, flexShrink:0, marginTop:5 }} />
              <span style={{ fontSize:12, color:THEME.muted2, lineHeight:1.6 }}>{f.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Notices panel */}
      <div style={{ background:THEME.card, border:`1px solid ${THEME.rose}30`, borderRadius:18, padding:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", color:THEME.rose, textTransform:"uppercase" }}>📋 Urgent Notices</span>
        </div>
        {SECTIONS.notices.urgent.map(n => <UrgentCard key={n.id} item={n} accent={THEME.rose} />)}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const accent = SECTION_COLOR[active]?.a || THEME.violet;
  const activeNav = NAV.find(n => n.id === active);

  return (
<div
  style={{
    width: "100vw",
    height: "100vh",
    background: THEME.bg,
    display: "flex",
    overflow: "hidden",
    position: "relative"
  }}
>
      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? 200 : 64,
        transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)",
        background: THEME.surface,
        borderRight:`1px solid ${THEME.border}`,
        display:"flex", flexDirection:"column",
        flexShrink:0, position:"relative", zIndex:10,
        height:"100vh", overflow:"hidden",
      }}>
        {/* logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${THEME.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg, ${THEME.violet}, ${THEME.mint})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, boxShadow: glow(THEME.violet, 8) }}>⬡</div>
          {sidebarOpen && <div>
            <div style={{ fontSize:13, fontWeight:800, color:THEME.text, letterSpacing:"-0.01em" }}>CampusAI</div>
            <div style={{ fontSize:9, color:THEME.muted }}>Smart Assistant</div>
          </div>}
        </div>

        {/* nav items */}
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:4, overflowY:"auto", scrollbarWidth:"none" }}>
          {NAV.map(n => {
            const col = SECTION_COLOR[n.id]?.a || THEME.violet;
            const isActive = active === n.id;
            return (
              <button key={n.id} onClick={()=>setActive(n.id)} style={{
                display:"flex", alignItems:"center", gap:10,
                padding: sidebarOpen ? "10px 12px" : "10px 0",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                borderRadius:12, border:"none",
                background: isActive ? `${col}20` : "transparent",
                color: isActive ? col : THEME.muted,
                cursor:"pointer", transition:"all 0.15s", width:"100%",
                boxShadow: isActive ? `inset 0 0 0 1px ${col}40` : "none",
              }}>
                <span style={{ fontSize:16, flexShrink:0, filter: isActive ? `drop-shadow(0 0 4px ${col})` : "none" }}>{n.icon}</span>
                {sidebarOpen && <span style={{ fontSize:12, fontWeight: isActive ? 700 : 500, whiteSpace:"nowrap" }}>{n.label}</span>}
                {sidebarOpen && isActive && <span style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:col, flexShrink:0 }} />}
              </button>
            );
          })}
        </nav>

        {/* collapse toggle */}
        <button onClick={()=>setSidebarOpen(p=>!p)} style={{
          margin:"12px 8px", padding:"9px", borderRadius:10,
          background:THEME.card, border:`1px solid ${THEME.border}`,
          color:THEME.muted, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center",
        }}>{sidebarOpen ? "◀" : "▶"}</button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>

        {/* TOPBAR / NAVBAR */}
        <div style={{ padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:`${THEME.surface}CC`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${THEME.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:accent, boxShadow: glow(accent) }} />
            <span style={{ fontSize:14, fontWeight:700, color:THEME.text }}>{activeNav?.label || "Dashboard"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* live time */}
            <LiveTime />
            {/* notification bell */}
            <div style={{ position:"relative" }}>
              <button style={{ background:THEME.card, border:`1px solid ${THEME.border}`, borderRadius:10, width:36, height:36, cursor:"pointer", color:THEME.muted2, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>🔔</button>
              <span style={{ position:"absolute", top:-3, right:-3, width:14, height:14, borderRadius:"50%", background:THEME.coral, fontSize:8, fontWeight:800, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${THEME.bg}` }}>5</span>
            </div>
            {/* user avatar */}
            <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${THEME.violet}, ${THEME.rose})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", boxShadow: glow(THEME.violet, 6), cursor:"pointer" }}>RS</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 24px", scrollbarWidth:"thin", scrollbarColor:`${THEME.border} transparent` }}>
          {active === "home"
            ? <HomeView navigate={setActive} />
            : SECTIONS[active]
              ? <SectionView id={active} />
              : <div style={{ color:THEME.muted, textAlign:"center", paddingTop:60 }}>Section coming soon…</div>
          }
        </div>
      </div>

      {/* ── ASK CHATBOT FAB ── */}
      <button
        onClick={()=>setChatOpen(o=>!o)}
        style={{
          position:"fixed", bottom:24, left: sidebarOpen ? 220 : 84,
          transition:"left 0.25s",
          width:50, height:50, borderRadius:"50%",
          background:`linear-gradient(135deg, ${THEME.violet}, ${THEME.mint})`,
          border:"none", cursor:"pointer", fontSize:20,
          boxShadow:`0 4px 20px ${THEME.violet}60, 0 0 0 2px ${THEME.violet}40`,
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:400,
          transform: chatOpen ? "rotate(45deg)" : "none",
          transitionProperty:"left, transform",
        }}
        title="Ask Campus AI"
      >{chatOpen ? "✕" : "🤖"}</button>

      {/* ── AI CHAT PANEL ── */}
      <AIChat open={chatOpen} onClose={()=>setChatOpen(false)} />

      {/* global keyframe for pulse */}
      <style>{`
        @keyframes pulse { from { opacity:0.4; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${THEME.border2}; border-radius:4px; }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
}

function LiveTime() {
  const [t, setT] = useState(new Date());
  useEffect(()=>{ const id = setInterval(()=>setT(new Date()), 1000); return ()=>clearInterval(id); }, []);
  return (
    <div style={{ fontSize:11, color:THEME.muted2, fontVariantNumeric:"tabular-nums" }}>
      {t.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}
    </div>
  );
}