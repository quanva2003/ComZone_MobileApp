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
      <View
        style={tw`flex flex-row items-center justify-between mt-3 p-3 bg-white rounded-3xl`}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuctionsHistory", { activeTab: "ONGOING" })
          }
        >
          <View style={tw`flex flex-col items-center px-3`}>
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

            <Text style={[{ fontFamily: "REM_bold" }, tw`text-sm`]}>
              Đang diễn ra
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuctionsHistory", { activeTab: "SUCCESSFUL" })
          }
        >
          <View style={tw`flex flex-col items-center px-8 border-l border-r`}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bell-electric"
            >
              <Path d="M18.8 4A6.3 8.7 0 0 1 20 9" />
              <Path d="M9 9h.01" />
              <Circle cx="10" cy="9" r="7" />
              <Rect width="10" height="6" x="4" y="16" rx="2" />
              <Path d="M14 19c3 0 4.6-1.6 4.6-1.6" />
              <Circle cx="20" cy="16" r="2" />
            </Svg>

            <Text style={[{ fontFamily: "REM_bold" }, tw`text-sm`]}>
              Thành công
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AuctionsHistory", { activeTab: "COMPLETED" })
          }
        >
          <View style={tw`flex flex-col items-center px-2`}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-check-big"
            >
              <Path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <Path d="m9 11 3 3L22 4" />
            </Svg>

            <Text style={[{ fontFamily: "REM_bold" }, tw`text-sm`]}>
              Hoàn thành
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileAuction;
