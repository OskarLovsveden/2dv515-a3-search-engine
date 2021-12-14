import Score from "models/Score";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDBData } from "utils/pageDBCache";
import QueryHandler from "utils/queryHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Score[] | { error: unknown }>
): Promise<void> {
  try {
    const {
      query: { q },
    } = req;

    const qh = new QueryHandler(await getDBData());

    res.status(200).json(await qh.query(q));
  } catch (error) {
    res.status(500).json({ error: "failed to load data.." });
  }
}
