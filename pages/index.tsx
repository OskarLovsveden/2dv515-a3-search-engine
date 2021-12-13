import PageDB from "models/PageDB";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "styles/Home.module.css";

type HomeProps = {
  pageDB: PageDB;
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("http://localhost:3000/api/search");
  const pageDB = await res.json();

  return {
    props: {
      pageDB,
    },
  };
};

const Home: NextPage<HomeProps> = ({ pageDB }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>A3 | 2dv515</title>
        <meta name="description" content="A3 2dv515" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>MAIN</main>
    </div>
  );
};

export default Home;
