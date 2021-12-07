// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getMembers from "utils/test";

type Member = {
  email: String;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Member[]>
): Promise<void> {
  res.status(200).json(await getMembers());
}
