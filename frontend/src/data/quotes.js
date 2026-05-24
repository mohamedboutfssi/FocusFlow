export const QUOTES = [
  { text: "Small progress is still progress.", author: "Anonymous" },
  { text: "Discipline beats motivation every single day.", author: "FocusFlow" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The more you do, the more you can do.", author: "William Hazlitt" },
  { text: "One hour of focused work beats eight hours of distraction.", author: "FocusFlow" },
  { text: "Your future self is cheering you on right now.", author: "FocusFlow" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "The key is not to prioritize your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "You are capable of amazing things.", author: "FocusFlow" },
  { text: "Every session counts. Every minute matters.", author: "FocusFlow" },
]

export const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
