import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import CurrencySplitter from "../../assistants/Spliter";
const PaymentDetail = ({ totalPrice, totalDeliveryPrice }) => {
  return (
    <View style={tw`p-3 bg-white rounded-xl`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
        CHI TIẾT THANH TOÁN
      </Text>
      <View style={tw`flex-row w-full justify-between mt-2 items-center`}>
        <Text style={{ fontFamily: "REM_regular" }}>Tổng tiền đơn hàng</Text>
        <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
          {CurrencySplitter(totalPrice)} đ
        </Text>
      </View>
      <View style={tw`flex-row w-full justify-between items-center`}>
        <Text style={{ fontFamily: "REM_regular" }}>
          Tổng tiền phí vận chuyển
        </Text>
        <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
          {CurrencySplitter(totalDeliveryPrice)} đ
        </Text>
      </View>
      <View
        style={tw`flex-row w-full justify-between mt-2 items-center pt-2 border-t border-gray-500`}
      >
        <Text style={{ fontFamily: "REM_regular" }}>Tổng thanh toán</Text>
        <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
          {CurrencySplitter(totalPrice + totalDeliveryPrice)} đ
        </Text>
      </View>
    </View>
  );
};

export default PaymentDetail;
