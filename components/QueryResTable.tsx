import styles from "styles/QueryResTable.module.css";
import { Score } from "types/Score";
import { round } from "utils/helpers";

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
          <td>{round(q.score)}</td>
          <td>{round(q.content)}</td>
          <td>{round(q.location)}</td>
          <td>0</td>
        </tr>
      ))}
    </table>
  );
};

export default QueryResTable;
