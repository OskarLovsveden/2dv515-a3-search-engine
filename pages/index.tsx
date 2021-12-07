import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import styles from "styles/Home.module.css";
import Member from "types/Member";

type HomeProps = {
  members: Member[];
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("http://localhost:3000/api/hello");
  const members = await res.json();
  console.log(members);

  return {
    props: {
      members,
    },
  };
};

const Home: NextPage<HomeProps> = ({ members }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>A3 | 2dv515</title>
        <meta name="description" content="A3 2dv515" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {members.map((member: Member, index: number) => (
          <p key={index}>{member.email}</p>
        ))}
      </main>
    </div>
  );
};

export default Home;
