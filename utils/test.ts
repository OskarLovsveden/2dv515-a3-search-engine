// Inspiration @ https://flaviocopes.com/nextjs-cache-data-globally/

import fs from "fs";

type Member = {
  email: String;
};

function fetchMembersData(): Member[] {
  console.log("Fetching members data...");
  return [{ email: "test1@email.com" }, { email: "test12@email.com" }];
}

const MEMBERS_CACHE_PATH = "data/members";

export default async function getMembers(): Promise<Member[]> {
  let cachedData;

  try {
    cachedData = JSON.parse(fs.readFileSync(MEMBERS_CACHE_PATH, "utf8"));
  } catch (error) {
    console.log("Member cache not initialized");
  }

  if (!cachedData) {
    const data = fetchMembersData();

    try {
      fs.writeFileSync(MEMBERS_CACHE_PATH, JSON.stringify(data), "utf8");
      console.log("Wrote to members cache");
    } catch (error) {
      console.log("ERROR WRITING MEMBERS CACHE TO FILE");
      console.log(error);
    }

    cachedData = data;
  }

  return cachedData;
}
