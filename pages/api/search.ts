import type { NextApiRequest, NextApiResponse } from "next";
import getPageDB from "utils/pageDBCache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | { error: unknown }>
): Promise<void> {
  try {
    const pageDB = await getPageDB();
    const {
      query: { q },
    } = req;

    const results: string[] = [];
    const searchWords = Array.isArray(q) ? q : q.split(" ");

    for (const word of searchWords) {
      const id = pageDB.getIdForWord(word);
      // console.log(id);
      for (const page of pageDB.pages) {
        if (page.words.includes(id)) {
          results.push(page.url);
        }
      }
    }

    console.log(pageDB);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "failed to load data.." });
  }
}
