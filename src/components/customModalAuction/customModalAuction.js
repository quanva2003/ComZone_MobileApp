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
}) => {
  const handleConfirm = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (userId) {
      // Make the real API call to place the deposit
      depositApiCall(auction)
        .then(() => {
          console.log("Deposit successful");
          onConfirm(); // Assuming this is a callback passed as a prop
          onClose();
        })
        .catch((error) => {
          console.error("Deposit failed:", error);
          alert("Đặt cọc thất bại. Vui lòng thử lại!");
        });
    } else {
      alert("Please log in");
      // Assuming this is how you navigate to login
      // dispatch(callbackUrl({ navigateUrl: location.pathname }));
      // navigate("/signin");
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

  return (
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
              onPress={handleConfirm} // Call handleConfirm on confirm
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
  );
};

export default CustomModal;
