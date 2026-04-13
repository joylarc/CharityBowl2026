import * as React from "react";

const { createContext, useContext } = React;

export type DonationMap = {
  [school: string]: number;
};

export type SchoolTotal = {
  school: string;
  total: number;
};

export type SchoolSet = {
  name: string;
  schools: SchoolTotal[];
};

function unwrap(text: string): string {
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  return text;
}

function readDonations(text: string): [DonationMap, string] {
  const lines = text.split("\n");
  // The first line is the timestamp
  const timestamp = unwrap(lines.shift() || "");

  const donations: DonationMap = {};
  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length != 2) {
      console.error("Invalid line in donations file: " + line);
      continue;
    }
    const school = unwrap(parts[0].trim());
    const amount = parseFloat(unwrap(parts[1].trim()));
    if (school === "" || isNaN(amount)) {
      console.error("Invalid school or amount in donations file: " + line);
      continue;
    }
    donations[school] = donations[school] || 0;
    donations[school] += amount;
  }
  return [donations, timestamp];
}

function readRivalries(text: string, donations: DonationMap): SchoolSet[] {
  const rivalries: SchoolSet[] = [];
  let name = null;
  let schools: SchoolTotal[] = [];
  const lines = text.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (line === "") {
      // empty line means end of rivalry
      if (name != null) {
        schools.sort((a, b) => b.total - a.total);
        rivalries.push({ name, schools });
        name = null;
        schools = [];
      }
    } else if (name == null) {
      name = line;
    } else {
      schools.push({ school: line, total: donations[line] || 0 });
    }
  }
  if (name != null) {
    schools.sort((a, b) => b.total - a.total);
    rivalries.push({ name, schools });
  }

  return rivalries;
}

let cachedLoad: Promise<AppState> | null = null;
export function createState(): Promise<AppState> {
  if (cachedLoad != null) {
    return cachedLoad;
  }
  const donationsPr = fetch("/donations.csv").then((res) => res.text());
  const rivalriesPr = fetch("/rivalries.txt").then((res) => res.text());
  const conferencesPr = fetch("/conferences.txt").then((res) => res.text());
  const schoolsPr = fetch("/schools.txt").then((res) => res.text());
  cachedLoad = Promise.all([donationsPr, rivalriesPr, conferencesPr, schoolsPr]).then(
    ([donationsMod, rivalriesMod, conferencesMod, schoolsMod]) => {
      const [donations, timestamp] = readDonations(donationsMod);
      // Build school index from schools.txt line order (stable IDs for short URLs)
      const schoolIndex: SchoolIndex = { nameToId: {}, idToName: {} };
      const schoolLines = schoolsMod.split("\n");
      for (let i = 0; i < schoolLines.length; i++) {
        const school = schoolLines[i].trim();
        if (!school) continue;
        schoolIndex.nameToId[school] = i;
        schoolIndex.idToName[i] = school;
        // Ensure every school appears in the donations map at $0
        if (!(school in donations)) {
          donations[school] = 0;
        }
      }
      const rivalries = readRivalries(rivalriesMod, donations);
      const conferences = readRivalries(conferencesMod, donations);
      return { timestamp, donations, rivalries, conferences, schoolIndex };
    }
  );
  return cachedLoad;
}

export type SchoolIndex = {
  nameToId: { [name: string]: number };
  idToName: { [id: number]: string };
};

export interface AppState {
  timestamp: string;
  donations: DonationMap;
  rivalries: SchoolSet[];
  conferences: SchoolSet[];
  schoolIndex: SchoolIndex;
}

export const AppContext = createContext<AppState>({
  timestamp: "",
  donations: {},
  rivalries: [],
  conferences: [],
  schoolIndex: { nameToId: {}, idToName: {} },
});

export function useAppState(): AppState {
  return useContext(AppContext);
}
