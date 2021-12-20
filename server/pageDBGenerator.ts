// Inspiration @ https://flaviocopes.com/nextjs-cache-data-globally/

import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import Page from "server/models/Page";
import PageDB from "server/models/PageDB";
import { createInterface } from "readline";

/**
 * Creates and returns an instance of PageDB.
 *
 * @returns {Promise<PageDB>} the page DB containing all pages of our dataset.
 */
export const getPageDB = async (): Promise<PageDB> => {
  const pageDB = new PageDB();
  const wordsDir = "data/wikipedia/Words";
  const linksDir = "data/wikipedia/Links";

  try {
    const subDirs = await readdir(wordsDir);
    for (const sd of subDirs) {
      const sd1Path = wordsDir + "/" + sd;
      const sd2Path = linksDir + "/" + sd;
      const sd1 = await readdir(sd1Path);

      for (const file of sd1) {
        const r1 = createInterface({
          input: createReadStream(sd2Path + "/" + file),
          crlfDelay: Infinity,
        });

        const links = new Set<string>();

        for await (const line of r1) {
          links.add(line.replace("/wiki/", "").trim());
        }

        const page = new Page(file, links);

        const r2 = createInterface({
          input: createReadStream(sd1Path + "/" + file),
          crlfDelay: Infinity,
        });

        for await (const line of r2) {
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
