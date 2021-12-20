import express, { Request, Response, NextFunction } from "express";
import { QueryHandler } from "./QueryHandler";
import { getPageDB } from "./pageDBGenerator";
import cors from "cors";

const pageDB = getPageDB();
const qh = new QueryHandler(pageDB);

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const port = 5050;

const searchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    query: { q },
  } = req;

  const qws = (q as string).split(" ");
  const result = await qh.query(qws);

  res.status(200).json(result);
};

app.get("/search", searchHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
