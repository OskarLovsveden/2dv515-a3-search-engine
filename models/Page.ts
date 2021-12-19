class Page {
  private _url: string;
  private _words: Array<number>;
  private _links: Set<string>;

  constructor(url: string) {
    this._url = url;
    this._words = new Array<number>();
    this._links = new Set<string>();
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
}

export default Page;
