import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import CurrencySplitter from "../../assistants/Spliter";

const PaymentDetail = ({
  totalPrice = 0,
  totalDeliveryPrice = 0,
  depositAmount = 0,
}) => {
  const totalPayable = totalPrice + totalDeliveryPrice;
  const remainingBalance = depositAmount - totalPayable;

  return (
    <View style={tw`p-3 bg-white rounded-xl`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
        CHI TIẾT THANH TOÁN
      </Text>

      {/* Order Total */}
      <View style={tw`flex-row w-full justify-between mt-2 items-center`}>
        <Text style={{ fontFamily: "REM_regular" }}>Tổng tiền đơn hàng</Text>
        <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
          {CurrencySplitter(totalPrice)} đ
        </Text>
      </View>

      {/* Delivery Fee */}
      <View style={tw`flex-row w-full justify-between items-center`}>
        <Text style={{ fontFamily: "REM_regular" }}>
          Tổng tiền phí vận chuyển
        </Text>
        <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
          {CurrencySplitter(totalDeliveryPrice)} đ
        </Text>
      </View>

      {/* Deposit Amount */}
      {depositAmount > 0 && (
        <View style={tw`flex-row w-full justify-between items-center mt-2`}>
          <Text style={{ fontFamily: "REM_regular" }}>Tổng cọc đấu giá</Text>
          <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
            - {CurrencySplitter(depositAmount)} đ
          </Text>
        </View>
      )}

      {/* Refund or Remaining Payment */}
      <View
        style={tw`flex-row w-full justify-between mt-2 items-center pt-2 border-t border-gray-500`}
      >
        {remainingBalance >= 0 ? (
          <>
            <Text style={[{ fontFamily: "REM_regular" }, tw`text-green-600`]}>
              Số tiền dư hoàn lại
            </Text>
            <Text
              style={[{ fontFamily: "REM_bold" }, tw`text-lg text-green-600`]}
            >
              {CurrencySplitter(remainingBalance)} đ
            </Text>
          </>
        ) : (
          <>
            <Text style={{ fontFamily: "REM_regular" }}>
              Tổng tiền thanh toán
            </Text>
            <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg text-black`]}>
              {CurrencySplitter(-remainingBalance)} đ
            </Text>
          </>
        )}
      </View>

      {/* Extra Note */}
      {remainingBalance > 0 && (
        <Text style={tw`text-sm text-gray-400 mt-2`}>
          Số tiền dư sẽ được hoàn lại vào ví của bạn sau khi đơn hàng hoàn
          thành.
        </Text>
      )}
    </View>
  );
};

export default PaymentDetail;
