import { FormEvent } from "react";
import { Score } from "types/Score";

type SearchbarProps = {
  resultHandler: (data: Array<Score>, time: number) => void;
};

const Searchbar = ({ resultHandler }: SearchbarProps) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const start = performance.now();

    const target = e.target as typeof e.target & {
      query: { value: string };
    };

    const res = await fetch(
      "http://localhost:3000/api/search?q=" +
        target.query.value.replaceAll(/\s+/gm, "+")
    );

    const data = await res.json();
    const end = performance.now();
    resultHandler(data, (end - start) / 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="query">Search query: </label>
      <input id="query" name="query" type="text" required />
      <button className="mx-1" type="submit">
        Search
      </button>
    </form>
  );
};

export default Searchbar;
