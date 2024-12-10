import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import tw from "twrnc";
import CurrencySplitter from "../assistants/Spliter";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WalletDeposit = ({ navigation, route }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const { userInfo } = route.params || {};
  console.log(process.env.BASE_URL);
  if (!userInfo) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={[tw`text-base`, { fontFamily: "REM_regular" }]}>
          User info is missing.
        </Text>
      </View>
    );
  }
  const predefinedAmounts = [50000, 100000, 200000, 500000];

  const handleDeposit = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("token wallet", token);

    const amount = parseFloat(depositAmount.replace(/\D/g, ""));

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    try {
      const resWalletDes = await axios.post(
        `${process.env.BASE_URL}wallet-deposits`,
        {
          amount: depositAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resZalopay = await axios.post(
        `${process.env.BASE_URL}zalopay`,
        {
          walletDeposit: resWalletDes.data.id,
          redirectPath: "Checkout",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("zalo pay", resZalopay.data.orderurl);

      const orderUrl = resZalopay.data.orderurl;

      // Check if ZaloPay app is installed
      const canOpenZaloPay = await Linking.canOpenURL(orderUrl);

      if (canOpenZaloPay) {
        // Open ZaloPay app
        await Linking.openURL(orderUrl);
      } else {
        // Fallback to web-based payment if app is not installed
        Alert.alert(
          "ZaloPay App Not Found",
          "Would you like to continue with web payment?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Continue",
              onPress: () => {
                // Open payment in default browser
                Linking.openURL(orderUrl);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Deposit error:", error);
      Alert.alert("Lỗi", "Không thể tạo đơn nạp tiền. Vui lòng thử lại sau.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-black py-5 shadow-lg`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-xl`,
            { fontFamily: "REM_bold" },
          ]}
        >
          Nạp tiền vào ví
        </Text>
      </View>

      <View style={tw`items-center mt-3 p-4`}>
        <View style={tw`flex-row items-center gap-1`}>
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
            class="lucide lucide-wallet"
            style={tw`mb-2`}
          >
            <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </Svg>
          <Text style={[tw`text-base mb-2`, { fontFamily: "REM_regular" }]}>
            Số dư hiện tại:
          </Text>
          <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
            {CurrencySplitter(userInfo.balance)} đ
          </Text>
        </View>

        <TextInput
          style={[
            tw`border p-3 rounded-lg w-full mb-4`,
            { fontFamily: "REM_regular" },
          ]}
          placeholder="Nhập số tiền muốn nạp"
          keyboardType="numeric"
          value={depositAmount ? CurrencySplitter(depositAmount) : ""}
          onChangeText={(text) => {
            console.log("text", text.replace(/\D/g, ""));

            setDepositAmount(text.replace(/\D/g, ""));
          }}
        />

        <View style={tw`flex-row justify-between w-full mb-4`}>
          {predefinedAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={tw`bg-white border border-black p-2 rounded-lg`}
              onPress={() => setDepositAmount(amount.toString())}
            >
              <Text style={[tw`text-black`, { fontFamily: "REM_regular" }]}>
                {CurrencySplitter(amount)} đ
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={tw`bg-black p-3 rounded-lg w-full`}
          onPress={handleDeposit}
        >
          <Text
            style={[
              tw`text-white text-center text-lg`,
              { fontFamily: "REM_bold" },
            ]}
          >
            Nạp Tiền
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WalletDeposit;
