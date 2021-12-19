import styles from "styles/QueryResTable.module.css";
import { Score } from "types/Score";
import { truncate } from "utils/helpers";

type QueryResTableProps = {
  queryRes: Array<Score>;
  startAt: number;
  endAt: number;
};

const QueryResTable = ({ queryRes, startAt, endAt }: QueryResTableProps) => {
  return (
    <table className={styles.table}>
      <tr>
        <th>Link</th>
        <th>Score</th>
        <th>Content</th>
        <th>Location</th>
        <th>PageRank</th>
      </tr>
      {queryRes.slice(startAt, endAt).map((q: Score, i: number) => (
        <tr key={i}>
          <td>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://en.wikipedia.org/wiki/${q.url}`}
            >
              {q.url}
            </a>
          </td>
          <td>{truncate(q.score, 2)}</td>
          <td>{truncate(q.content, 2)}</td>
          <td>{truncate(q.location, 2)}</td>
          <td>0</td>
        </tr>
      ))}
    </table>
  );
};

export default QueryResTable;
