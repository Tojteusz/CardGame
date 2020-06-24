import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ICard } from "./../interfaces/Interfaces";

interface ICardProps {
  back?: boolean;
  card?: ICard;
}

const Card = ({ back = false, card }: ICardProps) => {
  return (
    <React.Fragment>
      {back && (
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

      {!back && card && (
        <View style={[styles.cardSpace]}>
          <Image
            style={[styles.card]}
            resizeMode="contain"
            source={{
              uri: card.image,
            }}
          />
        </View>
      )}
    </React.Fragment>
  );
};

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

export default Card;
