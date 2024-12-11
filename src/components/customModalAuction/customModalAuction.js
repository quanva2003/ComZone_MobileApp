import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import tw from "twrnc";
import { privateAxios } from "../../middleware/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomModal = ({
  visible,
  onClose,
  title,
  description,
  onConfirm,
  auction,
  confirmText = "Confirm",
  cancelText = "Cancel",
  navigation, // Pass navigation prop for redirection
}) => {
  const [isDepositPromptOpen, setDepositPromptOpen] = useState(false);

  const handleConfirm = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (userId) {
      depositApiCall(auction)
        .then(() => {
          console.log("Deposit successful");
          onConfirm();
          onClose();
        })
        .catch((error) => {
          setDepositPromptOpen(true); // Open the "Nạp tiền" modal
        });
    } else {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.");
    }
  };

  const depositApiCall = async (auction) => {
    try {
      const response = await privateAxios.post(
        `/deposits/auction/${auction.id}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Deposit failed");
    }
  };

  const navigateToWalletDeposit = async () => {
    try {
      const currentUserJson = await AsyncStorage.getItem("currentUser");
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        setDepositPromptOpen(false);
        navigation.navigate("WalletDeposit", { userInfo: currentUser });
      } else {
        Alert.alert("Thông báo", "Không tìm thấy thông tin người dùng.");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      Alert.alert("Thông báo", "Đã xảy ra lỗi khi lấy thông tin người dùng.");
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`w-11/12 bg-white p-6 rounded-lg`}>
            <Text style={[tw`text-xl mb-4`, { fontFamily: "REM_bold" }]}>
              {title}
            </Text>
            <Text style={[tw`text-sm mb-4`, { fontFamily: "REM_regular" }]}>
              {description}
            </Text>
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 py-2 px-4 bg-gray-300 rounded-lg mr-2`}
                onPress={onClose}
              >
                <Text
                  style={[
                    tw`text-center`,
                    { fontFamily: "REM_bold", color: "#000" },
                  ]}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-2 px-4 bg-black rounded-lg ml-2`}
                onPress={handleConfirm}
              >
                <Text
                  style={[
                    tw`text-center`,
                    { fontFamily: "REM_bold", color: "#fff" },
                  ]}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for insufficient funds */}
      <Modal
        visible={isDepositPromptOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDepositPromptOpen(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`w-11/12 bg-white p-6 rounded-lg`}>
            <Text style={[tw`text-xl mb-4`, { fontFamily: "REM_bold" }]}>
              Số dư không đủ
            </Text>
            <Text style={[tw`text-sm mb-4`, { fontFamily: "REM_regular" }]}>
              Số dư trong ví của bạn không đủ để đặt cọc. Bạn có muốn nạp thêm
              tiền không?
            </Text>
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 py-2 px-4 bg-gray-300 rounded-lg mr-2`}
                onPress={() => setDepositPromptOpen(false)}
              >
                <Text
                  style={[
                    tw`text-center`,
                    { fontFamily: "REM_bold", color: "#000" },
                  ]}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-2 px-4 bg-black rounded-lg ml-2`}
                onPress={navigateToWalletDeposit}
              >
                <Text
                  style={[
                    tw`text-center`,
                    { fontFamily: "REM_bold", color: "#fff" },
                  ]}
                >
                  Nạp tiền
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomModal;
