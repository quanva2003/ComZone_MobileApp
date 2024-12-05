import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import Svg, { Circle, Path } from "react-native-svg";
import CurrencySplitter from "../../assistants/Spliter";
import { useNavigation } from "@react-navigation/native";
import { privateAxios } from "../../middleware/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileHeader = (currentUser) => {
  const navigation = useNavigation(); // Call useNavigation inside the component

  const handleLogout = async () => {
    try {
      // Call the API to log out the user
      const response = await privateAxios.post("/auth/logout");

      console.log("re", response);

      // Assuming the logout API returns a success message
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");

      // Use the navigation to redirect after logout
      navigation.navigate("SignIn");

      Alert.alert("Success", "You have logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Error", "Something went wrong. Please try again.");
    }
  };
  console.log(currentUser);

  return (
    <View style={tw`flex flex-col gap-5`}>
      <View
        style={tw`bg-neutral-900 rounded-3xl w-full p-3 flex flex-row justify-between items-center`}
      >
        <View style={tw`flex flex-row gap-2`}>
          <Image
            source={{
              uri: currentUser.currentUser?.avatar,
            }}
            style={tw`w-20 h-20 rounded-full border-2 border-white`}
          />
          <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg text-white`]}>
            {currentUser.currentUser?.name}
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <View>
              <Text
                style={[
                  { fontFamily: "REM_regular", color: "white" },
                  tw`text-lg`,
                ]}
              >
                Log out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <View style={tw`p-2 bg-white rounded-full`}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-settings"
              >
                <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <Circle cx="12" cy="12" r="3" />
              </Svg>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`bg-white rounded-3xl w-full p-3 flex flex-col `}>
        <View style={tw`flex flex-row gap-2 items-center`}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-wallet"
          >
            <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </Svg>
          <View>
            <View style={tw`flex flex-row items-center`}>
              <Text style={[{ fontFamily: "REM_regular" }, tw`text-lg`]}>
                Số dư ví:{" "}
              </Text>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-lg`]}>
                {currentUser.currentUser?.balance
                  ? `${CurrencySplitter(currentUser.currentUser.balance)}`
                  : "0"}
                đ
              </Text>
            </View>
            <View style={tw`flex flex-row gap-2 opacity-70`}>
              <Text style={[{ fontFamily: "REM_regular" }, tw`text-sm`]}>
                Hiện có thể rút:
              </Text>
              <Text style={[{ fontFamily: "REM_bold" }, tw`text-sm`]}>
                {currentUser.currentUser?.nonWithdrawableAmount
                  ? `${CurrencySplitter(
                      currentUser.currentUser.nonWithdrawableAmount
                    )}`
                  : "0"}{" "}
                đ
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`flex flex-row items-stretch justify-between mt-3`}>
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
                NẠP TIỀN
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
                RÚT TIỀN
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
                LỊCH SỬ VÍ
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
