import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

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
      console.log(state);

      if (state === userState) {
        setPoints(points + 1);
      }

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

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {!currentCard.code && (
          <Image
            style={[styles.cardSpace]}
            resizeMode="contain"
            source={{
              uri:
                "https://opengameart.org/sites/default/files/card%20back%20black.png",
            }}
          />
        )}

        {currentCard.code && (
          <Image
            style={[styles.cardSpace]}
            resizeMode="contain"
            source={{
              uri: currentCard.image,
            }}
          />
        )}

        <View style={[styles.bothCenter]}>
          <View style={styles.rowCenter}>
            <Text>Points: {points} </Text>
            <Text>Card left: {remaining} </Text>
          </View>
          <View>
            {remaining > 0 && (
              <React.Fragment>
                <Text>Next card will by higher or lower?</Text>
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
            <Button color="#c20b16" onPress={() => getDeck()} title="Restart" />
          </View>
        </View>
        {prevCard.code && (
          <Image
            style={[styles.cardSpace]}
            resizeMode="contain"
            source={{ uri: prevCard.image }}
          />
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
    backgroundColor: "#205b23",
    width: 200,
    height: 523,
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