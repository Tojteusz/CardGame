import React, { ReactElement } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { IHistoryElement, ICardSuitColor } from "../interfaces/Interfaces";

export interface ICardHistoryProps {
  history: IHistoryElement[];
}

/**
 * Card history component
 * @param {CardHistoryProps} props - history of game
 * @returns {ReactElement} - history list of rounds
 */
const CardHistory = ({ history }: ICardHistoryProps): ReactElement => {
  /**
   * Display element of history
   * current Card Code | >/< | previous Card Code | point
   * @param {HistoryElement} data - history card element
   * @returns {ReactElement} - item of history game round
   */
  const HistoryItem = ({ data }: { data: IHistoryElement }): ReactElement => {
    const prevSymbol = symbolByLetter(data.prev);
    const curSymbol = symbolByLetter(data.cur);
    return (
      <View style={styles.historyElement}>
        <Text style={[{ color: curSymbol.color }, styles.weight]}>
          {data.cur[0] == "0" ? 10 : data.cur[0]}
          {curSymbol.suit}
        </Text>
        <Text style={styles.weight}>{data.state === "lower" ? "<" : ">"}</Text>
        <Text style={[{ color: prevSymbol.color }, styles.weight]}>
          {data.prev[0] == "0" ? 10 : data.prev[0]}
          {prevSymbol.suit}
        </Text>
        <Text>{data.point ? "🟢" : "🔴"}</Text>
      </View>
    );
  };

  /**
   * determinate card symbol and color from card code
   * @param {string} letters - 2 letters code of card
   * @returns {ICardSuitColor} - suite & color of given card
   */
  const symbolByLetter = (letters: string): ICardSuitColor => {
    switch (letters[1]) {
      case "S":
        return {
          suit: "♣",
          color: "black",
        };
      case "D":
        return {
          suit: "♦",
          color: "red",
        };
      case "C":
        return {
          suit: "♠",
          color: "black",
        };
      default:
        return {
          suit: "♥",
          color: "red",
        };
    }
  };

  return (
    <React.Fragment>
      <Text>History:</Text>
      <FlatList
        style={styles.list}
        data={history}
        renderItem={({ item }) => <HistoryItem data={item} />}
        keyExtractor={(item) => item.prev}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  /* style of list */
  list: {
    maxHeight: 200,
  },
  /* style of history element */
  historyElement: {
    backgroundColor: "#205b23",
    padding: 3,
    marginBottom: 5,
    width: 100,
    borderRadius: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  /* weight of font style in list */
  weight: {
    fontWeight: "800",
  },
});

export default CardHistory;
