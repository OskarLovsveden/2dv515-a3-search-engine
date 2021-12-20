import Page from "models/Page";
import PageDB from "models/PageDB";

type Score = {
  url: string;
  score: number;
  content: number;
  location: number;
  pageRank: number;
};

export class QueryHandler {
  private pageDB: PageDB;

  constructor(pageDB: PageDB) {
    this.pageDB = pageDB;
  }

  /**
   * Generates wiki search results for a search query.
   *
   * @param {Array<string>} query a search string array.
   * @returns Promise object representing an array of scores/search results.
   */
  query = async (query: Array<string>): Promise<Array<Score>> => {
    const results = new Array<Score>();
    const content = new Array<number>();
    const location = new Array<number>();

    for (let i = 0; i < this.pageDB.size; i++) {
      const page = this.pageDB.pageAt(i);
      content[i] = this.getFrequencyScore(page, query);
      location[i] = this.getLocationScore(page, query);
    }

    this.calculatePageRank();
    this.normalize(content, false);
    this.normalize(location, true);

    for (let i = 0; i < this.pageDB.size; i++) {
      const page = this.pageDB.pageAt(i);

      if (content[i] > 0) {
        results.push({
          url: page.url,
          score: content[i] + 0.8 * location[i] + 0.5 * page.pageRank,
          content: content[i],
          location: location[i] * 0.8,
          pageRank: page.pageRank * 0.5,
        });
      }
    }

    return results.sort((a: Score, b: Score): number => b.score - a.score);
  };

  /**
   * Calculates a score representing how often a set of words are showing up on a wiki page.
   *
   * @private
   * @param {Page} page The page to check for a frequency score.
   * @param {Array<string>} query The set of words in the search string.
   */
  private getFrequencyScore = (page: Page, query: Array<string>): number => {
    let score = 0;

    for (const q of query) {
      const id = this.pageDB.getIdForWord(q);

      for (const word of page.words) {
        if (word === id) score++;
      }
    }

    return score;
  };

  /**
   * Calculates the distance between word pairs in the search query.
   * Only used on multiple words in a search query.
   *
   * @private
   * @param {Page} page The page to calculate word distance on.
   * @param {Array<string>} query The set of words in the search string.
   */
  private wordDistance = (page: Page, query: Array<string>): number => {
    let score = 0;

    for (let i = 0; i < query.length - 1; i++) {
      const q1 = new Array<string>(query[i]);
      const q2 = new Array<string>(query[i + 1]);

      const loc1 = this.getLocationScore(page, q1);
      const loc2 = this.getLocationScore(page, q2);

      score =
        loc1 === 100000 || loc2 === 100000
          ? (score += 100000)
          : (score += Math.abs(loc1 - loc2));
    }

    return score;
  };

  /**
   * Calculates how relevant a search query of words is to a page.
   *
   * @private
   * @param {Page} page The page to check for relevancy.
   * @param {Array<string>} query The set of words in the search string.
   */
  private getLocationScore = (page: Page, query: Array<string>): number => {
    let score = 0;

    for (const q of query) {
      let found = false;
      const id = this.pageDB.getIdForWord(q);

      for (let i = 0; i < page.wordAmount; i++) {
        if (page.wordAt(i) === id) {
          score += i + 1;
          found = true;
          break;
        }
      }

      if (!found) score += 100000;
    }

    return score;
  };

  /**
   *  Converts scores to a score between 0 and 1.
   *
   * @private
   * @param {Array<number>} scores a collection of scores.
   * @param {boolean} smallIsBetter true if small values are good, false otherwise.
   */
  private normalize = (scores: Array<number>, smallIsBetter: boolean) => {
    if (smallIsBetter) {
      const min = Math.min(...scores);

      for (let i = 0; i < scores.length; i++) {
        scores[i] = min / Math.max(scores[i], 0.00001);
      }
    } else {
      const max = Math.max(...scores, 0.00001);

      for (let i = 0; i < scores.length; i++) {
        scores[i] = scores[i] / max;
      }
    }
  };

  /**
   * Calculates and sets the PageRank of all the pages, iterates 20 times.
   *
   * @private
   */
  private calculatePageRank = () => {
    let ranks = Array<number>();

    for (let i = 0; i < 20; i++) {
      ranks = new Array<number>();

      for (const page of this.pageDB.pages) {
        ranks.push(this.iteratePR(page));
      }

      for (let j = 0; j < this.pageDB.size; j++) {
        this.pageDB.pageAt(j).pageRank = ranks[j];
      }
    }

    this.normalize(ranks, false);

    for (let i = 0; i < this.pageDB.size; i++) {
      this.pageDB.pageAt(i).pageRank = ranks[i];
    }
  };

  /**
   * Calculate page rank value for a page.
   *
   * @private
   * @param {Page} p The page of which to calculate the PageRank.
   * @returns {number} The PageRank result.
   */
  private iteratePR = (p: Page): number => {
    let pr = 0;

    for (const page of this.pageDB.pages) {
      if (page.hasLinkTo(p)) {
        pr += page.pageRank / page.getNoLinks();
      }
    }

    pr = 0.85 * pr + 0.15;
    return pr;
  };
}
