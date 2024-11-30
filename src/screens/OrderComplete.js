import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";

const OrderComplete = ({ navigation }) => {
  const handleNavigateToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={tw`flex-1 bg-white justify-center items-center p-5`}>
      <Image
        source={{
          uri: "https://example.com/success-icon.png", // Replace with your success icon URL
        }}
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
      <TouchableOpacity
        style={tw`bg-green-500 rounded-lg py-3 px-10 mt-5`}
        onPress={handleNavigateToHome}
      >
        <Text style={[tw`text-white text-base`, { fontFamily: "REM_bold" }]}>
          Về Trang Chủ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderComplete;
