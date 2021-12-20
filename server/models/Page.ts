class Page {
  private _url: string;
  private _words: Array<number>;
  private _links: Set<string>;
  pageRank: number;

  constructor(url: string, links: Set<string>) {
    this._url = url;
    this._words = new Array<number>();
    this._links = links;
    this.pageRank = 1.0;
  }

  get url(): string {
    return this._url;
  }

  get words(): Array<number> {
    return this._words;
  }

  get wordAmount(): number {
    return this._words.length;
  }

  addWordId(id: number) {
    this._words.push(id);
  }

  wordAt(index: number) {
    return this._words[index];
  }

  getNoLinks() {
    return this._links.size;
  }

  hasLinkTo(p: Page) {
    return this._links.has(p.url);
  }
}

export default Page;
