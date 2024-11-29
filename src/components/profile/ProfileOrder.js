import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import Svg, { Circle, Path } from "react-native-svg";

const ProfileOrder = () => {
  return (
    <View style={tw`bg-neutral-300 px-5 pt-3 pb-5 flex flex-col gap-2`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>ĐƠN MUA</Text>
      <View style={tw`bg-white rounded-3xl w-full p-3 flex flex-col `}>
        <View style={tw`flex flex-row items-stretch justify-between `}>
          <TouchableOpacity>
            <View style={tw`flex flex-col items-center px-2`}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-plus"
              >
                <Circle cx="12" cy="12" r="10" />
                <Path d="M8 12h8" />
                <Path d="M12 8v8" />
              </Svg>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-base`]}>
                Chờ xác nhận
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={tw`flex flex-col items-center px-5 border-l border-r`}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-plus"
              >
                <Circle cx="12" cy="12" r="10" />
                <Path d="M8 12h8" />
                <Path d="M12 8v8" />
              </Svg>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-base`]}>
                Chờ giao hàng
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={tw`flex flex-col items-center px-2`}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-plus"
              >
                <Circle cx="12" cy="12" r="10" />
                <Path d="M8 12h8" />
                <Path d="M12 8v8" />
              </Svg>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-base`]}>
                Đánh giá
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileOrder;
