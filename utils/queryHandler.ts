import Page from "models/Page";
import PageDB from "models/PageDB";
import Score from "models/Score";

class QueryHandler {
  private pageDB: PageDB;

  /**
   *
   * @param pageDB
   */
  constructor(pageDB: PageDB) {
    this.pageDB = pageDB;
  }

  /**
   * Generates wiki search results for a search query.
   *
   * @param {(string | string[])} query a single string or an array of strings.
   * @returns Promise object representing an array of scores/search results.
   */
  query = async (query: string | string[]): Promise<Array<Score>> => {
    const results = new Array<Score>();
    const content = new Array<number>();
    const location = new Array<number>();

    for (let i = 0; i < this.pageDB.size; i++) {
      const page = this.pageDB.pageAt(i);
      content[i] = this.getFrequencyScore(page, query);
      location[i] = this.getLocationScore(page, query);
    }

    this.normalize(content, false);
    this.normalize(location, true);

    for (let i = 0; i < this.pageDB.size; i++) {
      const page = this.pageDB.pageAt(i);

      if (content[i] > 0) {
        results.push(new Score(page.url, content[i], location[i]));
      }
    }

    return results.sort((a: Score, b: Score): number => b.score - a.score);
  };

  /**
   * Calculates a score representing how often a word or words are showing up on a wiki page.
   *
   * @private
   * @param {Page} page The page to check for a frequency score.
   * @param {(string[] | string)} query The query containging the word or words.
   */
  private getFrequencyScore = (
    page: Page,
    query: string[] | string
  ): number => {
    const qws = Array.isArray(query) ? query : query.split(" ");
    let score = 0;

    for (const q of qws) {
      const id = this.pageDB.getIdForWord(q);

      for (const word of page.words) {
        if (word === id) score++;
      }
    }

    return score;
  };

  /**
   * NOT IN USE!
   * @param page
   * @param query
   * @returns
   */
  private wordDistance = (page: Page, query: string | string[]): number => {
    // Split search query to get each word
    const qws = Array.isArray(query) ? query : query.split(" ");
    let score = 0;

    // Iterate over each pair if words in the search query
    for (let i = 0; i < qws.length - 1; i++) {
      //Use the document location function to get the
      //location of the words
      const loc1 = this.getLocationScore(page, qws[i]);
      const loc2 = this.getLocationScore(page, qws[i + 1]);

      //Increase the score by the distance between the two words,
      //or a high value if any word is not found in the page
      score =
        loc1 == 100000 || loc2 == 100000
          ? (score += 100000)
          : (score += Math.abs(loc1 - loc2));
    }

    return score;
  };

  private getLocationScore = (page: Page, query: string[] | string): number => {
    // Split search query to get each word
    const qws = Array.isArray(query) ? query : query.split(" ");
    let score = 0;

    // Iterate over each word in the search query
    for (const q of qws) {
      let found = false;

      const id = this.pageDB.getIdForWord(q);

      // Iterate over all words in the page
      for (let i = 0; i < page.words.length; i++) {
        // Score is the index of the first occurence of the word + 1
        // (to avoid zero scores)
        if (page.words[i] === id) {
          score += i + 1;

          // Stop once the word has been found
          found = true;
          break;
        }
      }

      // If the word is not found on the page, increase
      // the score by a high value
      if (!found) score += 100000;
    }

    // Return the score
    return score;
  };

  private normalize = (contentOrLocation: number[], smallIsBetter: boolean) => {
    if (smallIsBetter) {
      // Smaller values shall be inverted to higher values
      // and scaled between 0 and 1
      // Find min value in the array
      const min = Math.min(...contentOrLocation);

      // Divide the min value by the score
      // (and avoid division by zero)
      for (let i = 0; i < contentOrLocation.length; i++) {
        contentOrLocation[i] = min / Math.max(contentOrLocation[i], 0.00001);
      }
    } else {
      // Higher values shall be scaled between 0 and 1
      // Find max value in the array
      let max = Math.max(...contentOrLocation);

      // To avoid division by zero
      max = Math.max(max, 0.00001);

      // When we have a max value, divide all scores by it
      for (let i = 0; i < contentOrLocation.length; i++) {
        contentOrLocation[i] = contentOrLocation[i] / max;
      }
    }
  };
}

export default QueryHandler;
