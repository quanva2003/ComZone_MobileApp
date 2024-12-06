import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons"; // Icon library

const OrderComplete = () => {
  const navigation = useNavigation();
  const handleNavigateToHome = () => {
    navigation.navigate("Main");
  };

  return (
    <View style={tw`flex-1 bg-white justify-center items-center p-5`}>
      <TouchableOpacity
        style={tw`absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow`}
        onPress={() => navigation.push("Main")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../../assets/tick-circle.png")}
        style={tw`w-32 h-32 mb-5`}
        resizeMode="contain"
      />
      <Text style={[tw`text-xl text-center`, { fontFamily: "REM_bold" }]}>
        Đặt hàng thành công!
      </Text>
      <Text
        style={[
          tw`text-base text-gray-600 text-center mt-2`,
          { fontFamily: "REM_regular" },
        ]}
      >
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời
        gian sớm nhất.
      </Text>
      <View style={tw`flex-row gap-2 items-center`}>
        <TouchableOpacity
          style={tw`bg-sky-500 rounded-lg py-3 px-10 mt-5`}
          onPress={handleNavigateToHome}
        >
          <Text style={[tw`text-white text-base`, { fontFamily: "REM_bold" }]}>
            Về Trang Chủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-sky-500 rounded-lg py-3 px-10 mt-5`}
          onPress={() => navigation.push("OrderManagement")}
        >
          <Text style={[tw`text-white text-base`, { fontFamily: "REM_bold" }]}>
            Xem đơn hàng
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderComplete;
