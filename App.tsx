import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CardGame from "./components/CardGame";

export default function App() {
  return (
    <View style={styles.container}>
      <CardGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#308834",
    alignItems: "center",
    justifyContent: "center",
  },
});
