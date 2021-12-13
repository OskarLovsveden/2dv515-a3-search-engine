import type { NextApiRequest, NextApiResponse } from "next";

import PageDB from "models/PageDB";
import getPageDB from "utils/pageDBCache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PageDB>
): Promise<void> {
  res.status(200).json(await getPageDB());
}
