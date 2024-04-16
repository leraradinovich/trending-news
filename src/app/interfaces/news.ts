export interface News {
  by: string;
  descendants: number;
  id: number;
  kids: Array<number>;
  score: number;
  time: Date;
  title: string;
  type: string;
  url: string;
}
