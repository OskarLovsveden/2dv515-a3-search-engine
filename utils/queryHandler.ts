import Page from "models/Page";
import PageDB from "models/PageDB";
import Score from "models/Score";
import Scores from "models/Scores";

class QueryHandler {
  private pageDB: PageDB;

  constructor(pageDB: PageDB) {
    this.pageDB = pageDB;
  }

  query = async (query: string | string[]): Promise<Array<Score>> => {
    const results = new Array<Score>();
    const scores = new Scores();

    // Calculate score for each page in the pages database
    for (let i = 0; i < this.pageDB.pages.length; i++) {
      const page = this.pageDB.pages[i];
      scores.content[i] = this.getFrequencyScore(page, query);
      scores.location[i] = this.getLocationScore(page, query);
    }

    // Normalize scores
    this.normalize(scores.content, false);
    this.normalize(scores.location, true);

    // Generate result list
    for (let i = 0; i < this.pageDB.pages.length; i++) {
      const page = this.pageDB.pages[i];

      // Only include results where the word appears at least once
      if (scores.content[i] > 0) {
        results.push(
          new Score(page.url, scores.content[i], scores.location[i])
        );
      }
    }

    // Sort result list with highest score first and return it
    return results.sort((a: Score, b: Score): number => b.score - a.score);
  };

  private getFrequencyScore = (
    page: Page,
    query: string[] | string
  ): number => {
    // Split search query to get each word
    const qws = Array.isArray(query) ? query : query.split(" ");
    let score = 0;

    // Iterate over each word in the search query
    for (const q of qws) {
      const id = this.pageDB.getIdForWord(q);

      // Iterate over all words in the page
      for (const word of page.words) {
        // Increase score by one if the page word matches
        // the query word
        if (word === id) score++;
      }
    }

    // Return the score
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
