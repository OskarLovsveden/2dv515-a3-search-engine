type PageJson = {
  url: string;
  size: number;
};

class Page {
  private _url: string;
  private _words: number[];

  constructor(url: string) {
    this._url = url;
    this._words = [];
  }

  get url(): string {
    return this._url;
  }

  get words(): number[] {
    return this._words;
  }

  addWordId(id: number) {
    this._words.push(id);
  }

  //   toJSON(): PageJson {
  //     return {
  //       url: this._url,
  //       size: this._words.length,
  //     };
  //   }
}

export default Page;
