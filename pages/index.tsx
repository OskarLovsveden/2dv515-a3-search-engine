import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import styles from "styles/Home.module.css";

import QueryResTable from "components/QueryResTable";
import Searchbar from "components/Searchbar";
import { Score } from "types/Score";

const Home: NextPage = () => {
  const [queryTime, setQueryTime] = useState<number>(0);
  const [queryRes, setQueryRes] = useState<Array<Score>>(new Array<Score>());
  const [pagination, setPagination] = useState<number>(5);

  const onFirstPage = pagination === 5;
  const onLastPage = pagination + 5 > queryRes.length;
  const currentPage = pagination / 5;
  const lastPage = Math.round(queryRes.length / 5);
  const pageNumbers = "page " + currentPage + " of " + lastPage;
  const numOfResultsAndTime =
    "Found " + queryRes.length + " results in " + queryTime.toFixed(3) + " sec";

  const resultHandler = (data: Array<Score>, time: number) => {
    setQueryRes(data);
    setQueryTime(time);
    setPagination(5);
  };

  const pageBack = () => setPagination(pagination - 5);
  const pageForward = () => setPagination(pagination + 5);

  return (
    <div className={styles.container}>
      <Head>
        <title>A3 | 2dv515</title>
        <meta name="description" content="A3 2dv515" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Searchbar resultHandler={resultHandler} />
        {queryRes.length !== 0 && (
          <div>
            <div>
              <QueryResTable
                queryRes={queryRes}
                startAt={pagination - 5}
                endAt={pagination}
              />
              <button disabled={onFirstPage} onClick={pageBack}>
                {"<"}
              </button>
              <span className="mx-1">{pageNumbers}</span>
              <button disabled={onLastPage} onClick={pageForward}>
                {">"}
              </button>
            </div>
            <div>{numOfResultsAndTime}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
