import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const AuctionResult = ({ isWinner }) => {
  if (isWinner === null) {
    return null; // Only skip rendering if explicitly null
  }

  console.log("AuctionResult isWinner:", isWinner);

  return (
    <View
      style={[
        styles.auctionResult,
        { backgroundColor: isWinner ? "#d4edda" : "#f8d7da" },
      ]}
    >
      <Text
        style={[styles.resultText, { color: isWinner ? "#155724" : "#721c24" }]}
      >
        {isWinner
          ? "🎉 Chúc mừng bạn đã đấu giá thành công!"
          : "😞 Bạn đã đấu giá thất bại. Cọc đã được hoàn trả."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  auctionResult: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1, // For debugging visibility
    borderColor: "blue", // Temporary
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "REM",
  },
});
