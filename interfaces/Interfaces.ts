export interface ICard {
  code: string | false;
  image?: string;
  images?: string[];
  index?: number;
  value?:
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "JACK"
    | "QUEEN"
    | "KING"
    | "ACE";
  suit?: "Spades" | "Diamonds" | "Clubs" | "Hearts";
}

export interface IHistoryElement {
  prev: string;
  cur: string;
  state: "lower" | "higher";
  point: boolean;
}

export interface ICardSuitColor {
  suit: string;
  color: "black" | "red";
}

export interface IDeck {
  id: string;
  remaining: number;
}

export interface INewDeck {
  success: boolean;
  deck_id: string;
  cards: ICard[];
  remaining: number;
}
