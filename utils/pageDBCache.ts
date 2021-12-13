// Inspiration @ https://flaviocopes.com/nextjs-cache-data-globally/

import { createReadStream, readFileSync, writeFileSync } from "fs";
import { readdir } from "fs/promises";
import Page from "models/Page";
import PageDB from "models/PageDB";
import { createInterface } from "readline";

const getDBData = async (): Promise<PageDB> => {
  const pageDB = new PageDB();
  const startPath = "data/wikipedia/Words";

  try {
    const startDir = await readdir(startPath);

    for (const subDir of startDir) {
      const subDirPath = startPath + "/" + subDir;
      const files = await readdir(subDirPath);

      for (const file of files) {
        const page = new Page(file);

        const reader = createInterface({
          input: createReadStream(subDirPath + "/" + file),
          crlfDelay: Infinity,
        });

        for await (const line of reader) {
          const lineAsArray = line.split(" ");
          for (const word of lineAsArray) {
            page.addWordId(pageDB.getIdForWord(word));
          }
        }

        pageDB.addPage(page);
      }
    }
  } catch (e) {
    console.error(e);
  }

  return pageDB;
};

const PAGEDB_CACHE_PATH = "data/pageDB";

const getPageDB = async (): Promise<PageDB> => {
  console.time("Total time to get PageDB");
  let cachedData;

  try {
    cachedData = JSON.parse(readFileSync(PAGEDB_CACHE_PATH, "utf8"));
  } catch (error) {
    console.log("PageDB cache not initialized");
  }

  if (!cachedData) {
    const data = await getDBData();

    try {
      writeFileSync(PAGEDB_CACHE_PATH, JSON.stringify(data), "utf8");
      console.log("Wrote to pageDB cache");
    } catch (error) {
      console.log("ERROR WRITING PAGEDB CACHE TO FILE");
      console.log(error);
    }

    cachedData = data;
  }

  console.timeEnd("Total time to get PageDB");
  return cachedData;
};

export default getPageDB;
