class Score {
  url: string;
  score: number;
  content: number;
  location: number;

  constructor(url: string, content: number, location: number) {
    this.url = url;
    this.content = this.round(content);
    this.location = this.round(location * 0.8);
    this.score = this.round(this.content + this.location);
  }

  private round = (toBeRounded: number): number => {
    return Number.parseFloat(toBeRounded.toFixed(2));
  };
}

export default Score;
