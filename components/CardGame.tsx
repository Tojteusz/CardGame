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
import CardHistory from "./CardHistory";
import Card from "./Card";
import { IHistoryElement, INewDeck, ICard } from "../interfaces/Interfaces";

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

const CardGame = () => {
  const [remaining, setRemaining] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [history, setHistory] = useState<IHistoryElement[]>([]);
  const [currentCard, setCurrentCard] = useState<ICard>({
    code: false,
  });
  const [prevCard, setPrevCard] = useState<ICard>({
    code: false,
  });

  /**
   * find place in order of cards
   * @param {ICard} card - card to find index
   * @returns {number} - number of index
   */
  const indexOfOrderSuit = (card: ICard): number => {
    return cardOrder.findIndex((v: string) => v === card.value);
  };

  /** reset deck and point
   * @return void
   **/
  const getDeck = async () => {
    try {
      const response = await fetch(
        "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
      );

      const deck: INewDeck = await response.json();

      if (deck.success == false)
        throw "API deckofcardsapi not responding corectly";

      setPoints(0);

      setHistory([]);
      setPrevCard({
        ...deck.cards[0],
        ...{ index: indexOfOrderSuit(deck.cards[0]) },
      });
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

      const deck: INewDeck = await response.json();

      if (deck.success == false)
        throw "API deckofcardsapi not responding corectly";

      const card = deck.cards[0];

      const currentIndex: number = indexOfOrderSuit(card);

      setCurrentCard({ ...card, ...{ index: currentIndex } });

      let state: "higher" | "lower" = "lower";

      if (prevCard.index !== undefined) {
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

      if (prevCard.code != false && card.code != false) {
        const hEl: IHistoryElement = {
          prev: prevCard.code,
          cur: card.code,
          state: state,
          point: state === userState,
        };
        setHistory((old) => [hEl, ...old]);
      }

      setTimeout(
        () => nextRound({ ...deck.cards[0], ...{ index: currentIndex } }),
        500
      );

      setRemaining(deck.remaining);

      return deck;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /** start next round, clear current, set prev to current
   * @param {ICard} current - current card
   * @return void
   **/
  const nextRound = (current: ICard) => {
    setPrevCard(current);
    setCurrentCard({ code: false });
  };

  useEffect(() => {
    getDeck();
  }, []);

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {!currentCard.code && <Card back={true} />}
        {currentCard.code && <Card card={currentCard} />}

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
              style={[styles.buttonStyle]}
              onPress={() => getDeck()}
            >
              <Text>RESTART</Text>
            </TouchableOpacity>
          </View>
          <CardHistory history={history}></CardHistory>
        </View>
        {prevCard.code && <Card card={prevCard} />}
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
  buttonStyle: {
    marginBottom: 20,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#205b23",
  },
  blue: {
    backgroundColor: "#3232ff",
  },
  gold: {
    backgroundColor: "#e0a230",
  },
});
