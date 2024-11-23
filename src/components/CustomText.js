// src/components/CustomText.js
import React from "react";
import { Text, StyleSheet } from "react-native";

const CustomText = ({ style, ...props }) => {
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "REM", // Use your custom font here
  },
});

export default CustomText;
