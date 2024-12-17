import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Svg, { Circle, G, Path, Polyline, Rect } from "react-native-svg";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
const ProfileAuction = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`px-5 py-3`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>ĐẤU GIÁ</Text>
      <TouchableOpacity
        style={tw`flex flex-row items-center justify-between mt-3 p-3 bg-white rounded-3xl`}
        onPress={() =>
          navigation.navigate("AuctionsHistory", { activeTab: "Tất cả" })
        }
      >
        <View>
          <View style={tw`flex flex-row gap-3  items-center px-3`}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx="12" cy="12" r="10" />
              <Polyline points="12 6 12 12 16 14" />
            </Svg>

            <Text style={[{ fontFamily: "REM_bold" }, tw`text-base`]}>
              Lịch sử đấu giá
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileAuction;
