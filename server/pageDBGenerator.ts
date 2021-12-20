import { readdirSync, readFileSync } from "fs";
import path from "path";
import Page from "./models/Page";
import PageDB from "./models/PageDB";

/**
 * Creates and returns an instance of PageDB.
 *
 * @returns {Promise<PageDB>} the page DB containing all pages of our dataset.
 */
export const getPageDB = (): PageDB => {
  const pageDB = new PageDB();

  try {
    const wordsDir = path.join(__dirname, "wikipedia", "Words");
    const linksDir = path.join(__dirname, "wikipedia", "Links");

    const subDirs = readdirSync(wordsDir, "utf-8");
    for (const subdir of subDirs) {
      const subdirPathOne = path.join(wordsDir, subdir);
      const subdirPathTwo = path.join(linksDir, subdir);

      const sd1 = readdirSync(subdirPathOne, "utf-8");
      const sd2 = readdirSync(subdirPathTwo, "utf-8");

      for (const file of sd1) {
        const r1 = readFileSync(path.join(subdirPathTwo, file), "utf-8");

        const links = new Set<string>();
        const lines1 = r1.trim().split(/\r?\n/);

        for (const line of lines1) {
          links.add(line.replace("/wiki/", "").trim());
        }

        const page = new Page(file, links);

        const r2 = readFileSync(path.join(subdirPathOne, file), "utf-8");
        const lines2 = r2.trim().split(/\r?\n/);
        for (const line of lines2) {
          const words = line.trim().split(" ");
          for (const word of words) {
            page.addWordId(pageDB.getIdForWord(word));
          }
        }

        pageDB.addPage(page);
      }
    }

    calculatePageRank(pageDB);
  } catch (e) {
    console.error(e);
  }

  return pageDB;
};

/** Calculates and sets the PageRank of all the pages, iterates 20 times. */
const calculatePageRank = (pageDB: PageDB) => {
  let ranks = Array<number>();

  for (let i = 0; i < 20; i++) {
    ranks = new Array<number>();

    for (const page of pageDB.pages) {
      ranks.push(iteratePR(page, pageDB));
    }

    for (const [j, page] of pageDB.pages.entries()) {
      page.pageRank = ranks[j];
    }
  }
};

/**
 * Calculate page rank value for a page.
 *
 * @param {Page} p The page of which to calculate the PageRank.
 * @returns {number} The PageRank result.
 */
const iteratePR = (p: Page, pageDB: PageDB): number => {
  let pr = 0;

  for (const page of pageDB.pages) {
    if (page.hasLinkTo(p)) {
      pr += page.pageRank / page.getNoLinks();
    }
  }

  pr = 0.85 * pr + 0.15;
  return pr;
};
