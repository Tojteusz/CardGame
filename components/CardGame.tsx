import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

const cardOrder = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
  "ACE",
];

const suitOrder = ["Hearts", "Diamonds", "Spades", "Clubs"];

interface Card {
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

interface HistoryElement {
  prev: string;
  cur: string;
  state: "lower" | "higher";
  point: boolean;
}

interface Deck {
  id: string;
  remaining: number;
}

interface NewDeck {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
}

interface Props {}

const CardGame = (props: Props) => {
  const [remaining, setRemaining] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [history, setHistory] = useState<HistoryElement[]>([]);

  const [currentCard, setCurrentCard] = useState<Card>({
    code: false,
  });

  const [prevCard, setPrevCard] = useState<Card>({
    code: false,
  });

  /** reset deck and point
   * @return void
   **/
  const getDeck = async () => {
    try {
      const response = await fetch(
        "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
      );

      const deck: NewDeck = await response.json();

      if (deck.success == false)
        throw "API deckofcardsapi not responding corectly";

      setPoints(0);

      const prevIndex: number = cardOrder.findIndex(
        (v: string) => v === deck.cards[0].value
      );
      setPrevCard({ ...deck.cards[0], ...{ index: prevIndex } });
      setRemaining(deck.remaining);
      setId(deck.deck_id);
    } catch (error) {
      console.error(error);
    }
  };

  /** take new card from deck and compare with prev
   * @param {"higher"|"lower"} userState - user selection higer or lower next card
   * @return void
   **/
  const nextCard = async (userState: "higher" | "lower") => {
    try {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`
      );

      const deck: NewDeck = await response.json();

      if (deck.success == false)
        throw "API deckofcardsapi not responding corectly";

      const card = deck.cards[0];

      const currentIndex: number = cardOrder.findIndex(
        (v: string) => v === card.value
      );
      await setCurrentCard({ ...card, ...{ index: currentIndex } });

      let state: "higher" | "lower" = "lower";

      if (prevCard.index) {
        if (currentIndex > prevCard.index) {
          state = "higher";
        } else if (currentIndex == prevCard.index) {
          const currentSuit: number = suitOrder.findIndex(
            (v: string) => v === card.suit
          );
          const prevSuit: number = suitOrder.findIndex(
            (v: string) => v === prevCard.suit
          );
          if (currentSuit > prevSuit) {
            state = "higher";
          }
        }
      }

      if (state === userState) {
        setPoints(points + 1);
      }

      console.log(prevCard.code);
      console.log(card.code);
      if (prevCard.code != false && card.code != false) {
        const hEl: HistoryElement = {
          prev: prevCard.code,
          cur: card.code,
          state: state,
          point: state === userState,
        };
        setHistory((old) => [hEl, ...old]);
      }
      console.log(history);

      setTimeout(
        () => nextRound({ ...deck.cards[0], ...{ index: currentIndex } }),
        2000
      );

      setRemaining(deck.remaining);

      return deck;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /** start next round, clear current, set prev to current
   * @param {Card} current - current card
   * @return void
   **/
  const nextRound = (current: Card) => {
    setPrevCard(current);
    setCurrentCard({ code: false });
  };

  useEffect(() => {
    getDeck();
  }, []);

  const symbolByLetter = (
    letter: string
  ): { s: string; c: "black" | "red" } => {
    letter[1];

    switch (letter[1]) {
      case "S":
        return { s: "♣", c: "black" };
      case "D":
        return { s: "♦", c: "red" };
      case "C":
        return { s: "♠", c: "black" };
      default:
        return { s: "♥", c: "red" };
    }
  };

  const HistoryItem = ({ data }: { data: HistoryElement }) => {
    const prevSymbol = symbolByLetter(data.prev);
    const curSymbol = symbolByLetter(data.cur);
    return (
      <View
        style={{
          backgroundColor: "#205b23",
          padding: 3,
          marginBottom: 5,
          width: 100,
          borderRadius: 5,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={[{ color: curSymbol.c }]}>
          {data.cur[0] == "0" ? 10 : data.cur[0]}
          {curSymbol.s}
        </Text>
        <Text>{data.state === "lower" ? "<" : ">"}</Text>
        <Text style={[{ color: prevSymbol.c }]}>
          {data.prev[0] == "0" ? 10 : data.prev[0]}
          {prevSymbol.s}
        </Text>
        <Text>{data.point ? "🟢" : "🔴"}</Text>
      </View>
    );
  };

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {!currentCard.code && (
          <View style={[styles.cardSpace]}>
            <Image
              style={[styles.card]}
              resizeMode="contain"
              source={{
                uri:
                  "https://opengameart.org/sites/default/files/card%20back%20black.png",
              }}
            />
          </View>
        )}

        {currentCard.code && (
          <View style={[styles.cardSpace]}>
            <Image
              style={[styles.card]}
              resizeMode="contain"
              source={{
                uri: currentCard.image,
              }}
            />
          </View>
        )}

        <View style={[styles.bothCenter]}>
          <Text style={{ fontSize: 30, fontWeight: "900", color: "white" }}>
            LOWER or HIGHER
          </Text>
          <View
            style={[
              styles.rowCenter,
              { width: 300, justifyContent: "space-between", marginBottom: 40 },
            ]}
          >
            <Text style={{ fontSize: 20 }}>Points 🟢: {points} </Text>
            <Text style={{ fontSize: 20 }}>Card left 🃏: {remaining} </Text>
          </View>
          <View style={{ marginBottom: 30 }}>
            {remaining > 0 && (
              <React.Fragment>
                <Text>Will the next card be higher or lower?</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    disabled={currentCard.code != false}
                    color="#e0a230"
                    onPress={() => nextCard("higher")}
                    title="Higher"
                  />
                  <Button
                    disabled={currentCard.code != false}
                    onPress={() => nextCard("lower")}
                    title="Lower"
                  />
                </View>
              </React.Fragment>
            )}
            {remaining <= 0 && (
              <React.Fragment>
                <Text style={[styles.gameover]}>Game Over</Text>
                <Text style={[styles.gameover]}>Your score: {points}</Text>
              </React.Fragment>
            )}
          </View>

          <View style={{}}>
            <TouchableOpacity
              style={{
                marginBottom: 20,
                padding: 8,
                borderRadius: 5,
                backgroundColor: "#205b23",
              }}
              onPress={() => getDeck()}
            >
              <Text>RESTART</Text>
            </TouchableOpacity>
          </View>
          <Text>History:</Text>
          <FlatList
            style={{ maxHeight: 200, overflow: "hidden" }}
            data={history}
            renderItem={({ item }) => <HistoryItem data={item} />}
            keyExtractor={(item) => item.prev}
          />
        </View>
        {prevCard.code && (
          <View style={[styles.cardSpace]}>
            <Image
              style={[styles.card]}
              resizeMode="contain"
              source={{ uri: prevCard.image }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CardGame;

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSpace: {
    borderRadius: 20,
    backgroundColor: "#205b23",
    padding: 20,
  },
  card: {
    width: 300,
    height: 523,
    borderRadius: 20,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#e0a230",
  },
  gameover: { fontSize: 30, color: "white" },
  rowCenter: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bothCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
});
