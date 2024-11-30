import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

const CurrentAddress = (userAddress) => {
  const addresses = userAddress.userAddress;

  return (
    <View>
      <Text>CurrentAddress</Text>
    </View>
  );
};

export default CurrentAddress;
