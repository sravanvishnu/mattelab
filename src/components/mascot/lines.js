// MatteLab mascot voice lines and targeted action prompts

export const pickLine = (arr) => {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return typeof item === "string" ? { text: item } : item;
};

// Said when the mascot wakes up (touched, or randomly)
export const WAKE = [
  { text: "Hm? You rang?" },
  { text: "Oh! Hi maker. Watch this." },
  { text: "I was NOT sleeping on the workbench." },
  { text: "Okay okay, I'm online." },
  { text: "Finally, someone with maker initiative." },
  { text: "Power rails stabilized. What are we building today?" },
];

// Motivating questions & maker thoughts (NO default options unless asked)
export const QUESTIONS = [
  { text: "If your hardware project had a villain, what would its name be?" },
  { text: "What would you build if you knew it would work on the first try?" },
  { text: "Which machine in MatteLab is secretly your favorite? Don't lie." },
  { text: "What's the smallest working version of your idea? Build that first." },
  { text: "What have you been 'about to start' since last semester?" },
  { text: "If you could add one physical button to reality, what would it trigger?" },
  { text: "Is it a bug, or an undocumented feature nobody asked for yet?" },
  { text: "Name one item in your backpack that could become part of a robot." },
  { text: "On a scale from 'pencil sketch' to 'magic smoke came out', where is your project?" },
  { text: "Would you rather finish one tiny PCB today or start three giant builds?" },
  { text: "Who on campus would be delighted to see your working prototype?" },
  { text: "What could you make ugly-but-working by Friday night?" },
  { text: "The 3D printer bed is freshly leveled. What are you waiting for?" },
  { text: "MatteLab rule #1: If it smokes, unplug first, panic second." },
  { text: "Have you pushed your code to GitHub before testing high voltage?" },
  {
    text: "Got an idea for a campus workshop? Want to submit an event proposal?",
    action: "propose_event",
    actionLabel: "Propose Event"
  },
];

// Nudges when the lab has no booking right now
export const FREE = [
  { text: "The lab looks quiet right now. Perfect time to prototype!" },
  { text: "No active machine reservations at this moment. Free workbench real estate." },
  { text: "The soldering stations are ready. Time to melt some lead-free solder?" },
  { text: "Lab's open and free right now. Jump in before the rush!" },
  {
    text: "Empty 3D printers, full potential. Want to check the equipment schedule?",
    action: "view_schedule",
    actionLabel: "View Schedule"
  },
];

export const FREE_UNTIL = (time) => ({
  text: `Lab is free until ${time}. Plenty of time to solder or print something legendary.`,
  action: "view_schedule",
  actionLabel: "View Schedule"
});

// Nudges when someone is booked in
export const BUSY = [
  { text: "Makers are actively building in the lab right now. Respect the chaos!" },
  {
    text: "Machinery is booked right now. Check the calendar and reserve your slot ahead.",
    action: "view_schedule",
    actionLabel: "View Schedule"
  },
  { text: "Active builds underway! Check the schedule for the next open time." },
];

// Outside opening hours
export const CLOSED = [
  { text: "Makerspace is closed for the night. Dream up your next schematic!" },
  {
    text: "Lab's closed right now (08:30 - 20:00). Check tomorrow's schedule and plan your build.",
    action: "view_schedule",
    actionLabel: "View Schedule"
  },
];
