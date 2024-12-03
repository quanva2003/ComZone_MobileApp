import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import CurrencySplitter from "../../assistants/Spliter";
import { useNavigation } from "@react-navigation/native";

const PaymentMethod = ({
  userInfo,
  totalPrice,
  selectedMethod,
  setSelectedMethod,
}) => {
  const paymentMethods = [
    {
      id: "WALLET",
      label: "Thanh toán bằng ví ComZone",
      isDisabled: userInfo.balance < totalPrice,
    },
    {
      id: "COD",
      label: "Thanh toán khi nhận hàng",
      isDisabled: false,
    },
  ];
  const navigate = useNavigation();
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
  };
  useEffect(() => {
    userInfo.balance < totalPrice
      ? setSelectedMethod("COD")
      : setSelectedMethod("WALLET");
  }, [userInfo, totalPrice]);
  return (
    <View style={tw`p-3 bg-white rounded-xl`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
        PHƯƠNG THỨC THANH TOÁN
      </Text>

      <View style={tw`flex-row gap-1 items-center mt-2`}>
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
          class="lucide lucide-banknote"
        >
          <Rect width="20" height="12" x="2" y="6" rx="2" />
          <Circle cx="12" cy="12" r="2" />
          <Path d="M6 12h.01M18 12h.01" />
        </Svg>
        <Text style={[tw`text-base`, { fontFamily: "REM_regular" }]}>
          Số dư ví:{" "}
        </Text>
        <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
          {userInfo ? CurrencySplitter(userInfo.balance) + " đ" : "0 đ"}
        </Text>
      </View>

      <View style={tw`mt-3`}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={tw`p-2 border rounded-lg mb-3 ${
              selectedMethod === method.id
                ? "bg-sky-100 border-sky-500"
                : "bg-white border-white"
            } ${method.isDisabled ? "opacity-50" : ""}`}
            onPress={() => !method.isDisabled && handleSelectMethod(method.id)}
            disabled={method.isDisabled}
          >
            <Text
              style={[
                tw`text-base`,
                {
                  fontFamily: "REM_regular",
                  color: method.isDisabled ? tw`text-gray-400` : tw`text-black`,
                },
              ]}
            >
              {method.label}
            </Text>
            {method.isDisabled && (
              <Text
                style={[tw`text-xs text-red-500`, { fontFamily: "REM_italic" }]}
              >
                Số dư của bạn không đủ, vui lòng nạp tiền
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {userInfo.balance < totalPrice && (
          <TouchableOpacity
            style={tw`p-2 border rounded-lg bg-sky-800 mt-3`}
            onPress={() => navigate.navigate("WalletDeposit", { userInfo })}
          >
            <Text
              style={[
                tw`text-base text-white text-center`,
                { fontFamily: "REM_regular" },
              ]}
            >
              Nạp tiền
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PaymentMethod;
