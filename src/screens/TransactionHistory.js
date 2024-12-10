import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import CurrencySplitter from "../assistants/Spliter";
const TransactionHistory = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1`}>
      <View style={tw`bg-black py-5 shadow-lg items-center`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text
            style={[
              tw`text-center text-white text-2xl `,
              { fontFamily: "REM_bold" },
            ]}
          >
            LỊCH SỬ VÍ
          </Text>
          {/* <View>
            <View style={tw`flex flex-row items-center`}>
              <Text style={[{ fontFamily: "REM_regular" }, tw`text-lg`]}>
                Số dư ví:{" "}
              </Text>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
                {currentUser?.balance
                  ? `${CurrencySplitter(currentUser.balance)}`
                  : "0"}
                đ
              </Text>
            </View>
            <View style={tw`flex flex-row gap-2 opacity-70`}>
              <Text style={[{ fontFamily: "REM_regular" }, tw`text-sm`]}>
                Hiện có thể rút:
              </Text>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-sm`]}>
                {currentUser?.nonWithdrawableAmount
                  ? `${CurrencySplitter(currentUser.nonWithdrawableAmount)}`
                  : "0"}{" "}
                đ
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default TransactionHistory;
