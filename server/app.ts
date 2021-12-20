import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = 5050;

const searchHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const {
    query: { q },
  } = request;

  console.log((request.query.q as string).split(" "));
  response.status(200).json([]);
};

app.get("/search", searchHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
