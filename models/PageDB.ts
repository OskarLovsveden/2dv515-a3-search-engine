import Page from "./Page";

class PageDB {
  private _wordToId: Map<string, number>;
  private _pages: Array<Page>;

  constructor() {
    this._wordToId = new Map<string, number>();
    this._pages = new Array<Page>();
  }

  get size(): number {
    return this._pages.length;
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

  pageAt(index: number) {
    return this._pages[index];
  }
}

export default PageDB;
