export type ParsedQuickTask = {
  title: string;
  dueDate: Date | null;
  priority: "low" | "medium" | "high";
  category: string | null;
  matched: { date?: string; priority?: string; category?: string };
};

const WEEKDAYS: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, weds: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function nextWeekday(from: Date, target: number, forceNext: boolean): Date {
  const cur = from.getDay();
  let diff = (target - cur + 7) % 7;
  if (diff === 0) diff = 7;
  if (forceNext) diff += 7;
  return addDays(from, diff);
}

function tryDate(working: string, today: Date): { date: Date; matched: string; rest: string } | null {
  const patterns: Array<{ re: RegExp; fn: (m: RegExpMatchArray) => Date | null }> = [
    { re: /\b(today|tdy)\b/i, fn: () => today },
    { re: /\b(tomorrow|tmrw|tmr|tom)\b/i, fn: () => addDays(today, 1) },
    {
      re: /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat)\b/i,
      fn: (m) => nextWeekday(today, WEEKDAYS[m[1].toLowerCase()], true),
    },
    {
      re: /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat)\b/i,
      fn: (m) => nextWeekday(today, WEEKDAYS[m[1].toLowerCase()], false),
    },
    {
      re: /\bin\s+(\d+)\s*(day|days|d|week|weeks|w)\b/i,
      fn: (m) => {
        const n = parseInt(m[1], 10);
        const isWeek = /^w/i.test(m[2]);
        return addDays(today, n * (isWeek ? 7 : 1));
      },
    },
    {
      re: /\b(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
      fn: (m) => {
        const month = MONTHS[m[1].toLowerCase()];
        const day = parseInt(m[2], 10);
        if (day < 1 || day > 31) return null;
        let year = today.getFullYear();
        const candidate = new Date(year, month, day);
        if (candidate < today) year += 1;
        return new Date(year, month, day);
      },
    },
    {
      re: /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/,
      fn: (m) => {
        const month = parseInt(m[1], 10) - 1;
        const day = parseInt(m[2], 10);
        if (month < 0 || month > 11 || day < 1 || day > 31) return null;
        let year = today.getFullYear();
        if (m[3]) {
          const y = parseInt(m[3], 10);
          year = y < 100 ? 2000 + y : y;
        } else {
          const candidate = new Date(year, month, day);
          if (candidate < today) year += 1;
        }
        return new Date(year, month, day);
      },
    },
  ];

  for (const { re, fn } of patterns) {
    const match = working.match(re);
    if (match) {
      const date = fn(match);
      if (date) {
        return { date, matched: match[0], rest: (working.slice(0, match.index!) + working.slice(match.index! + match[0].length)).trim() };
      }
    }
  }
  return null;
}

function tryPriority(working: string): { priority: "low" | "medium" | "high"; matched: string; rest: string } | null {
  const re = /(?:^|\s)!(high|h|medium|med|m|low|l)\b/i;
  const match = working.match(re);
  if (!match) return null;
  const v = match[1].toLowerCase();
  const priority: "low" | "medium" | "high" =
    v.startsWith("h") ? "high" : v.startsWith("l") ? "low" : "medium";
  const rest = (working.slice(0, match.index!) + working.slice(match.index! + match[0].length)).trim();
  return { priority, matched: match[0].trim(), rest };
}

function tryCategory(working: string, categories: string[]): { category: string; matched: string; rest: string } | null {
  const re = /(?:^|\s)#([A-Za-z][A-Za-z0-9-]*)\b/;
  const match = working.match(re);
  if (!match) return null;
  const token = match[1].toLowerCase();
  const found = categories.find((c) => c.toLowerCase() === token)
    ?? categories.find((c) => c.toLowerCase().startsWith(token));
  if (!found) return null;
  const rest = (working.slice(0, match.index!) + working.slice(match.index! + match[0].length)).trim();
  return { category: found, matched: match[0].trim(), rest };
}

export function parseQuickTask(input: string, categories: string[]): ParsedQuickTask {
  const today = startOfDay(new Date());
  let working = input.trim();
  const matched: ParsedQuickTask["matched"] = {};

  const p = tryPriority(working);
  let priority: "low" | "medium" | "high" = "medium";
  if (p) {
    priority = p.priority;
    matched.priority = p.matched;
    working = p.rest;
  }

  const c = tryCategory(working, categories);
  let category: string | null = null;
  if (c) {
    category = c.category;
    matched.category = c.matched;
    working = c.rest;
  }

  const d = tryDate(working, today);
  let dueDate: Date | null = null;
  if (d) {
    dueDate = d.date;
    matched.date = d.matched;
    working = d.rest;
  }

  const title = working.replace(/\s+/g, " ").trim();
  return { title, dueDate, priority, category, matched };
}

export function formatParsedHint(parsed: ParsedQuickTask): string {
  const bits: string[] = [];
  if (parsed.dueDate) {
    bits.push(parsed.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  if (parsed.priority !== "medium") bits.push(parsed.priority);
  if (parsed.category) bits.push(`#${parsed.category}`);
  return bits.join(" · ");
}
