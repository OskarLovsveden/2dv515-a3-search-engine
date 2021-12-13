import Page from "./Page";

type PageDBJson = {
  wordToId: number;
  pages: Page[];
};

class PageDB {
  private _wordToId: Map<string, number>;
  private _pages: Page[];

  constructor() {
    this._wordToId = new Map<string, number>();
    this._pages = [];
  }

  getIdForWord(word: string): number {
    if (this._wordToId.has(word)) {
      return this._wordToId.get(word) as number;
    } else {
      const id = this._wordToId.size;
      this._wordToId.set(word, id);
      return id;
    }
  }

  addPage(page: Page) {
    this._pages.push(page);
  }

  toJSON(): PageDBJson {
    return {
      wordToId: this._wordToId.size,
      pages: this._pages,
    };
  }
}

export default PageDB;
