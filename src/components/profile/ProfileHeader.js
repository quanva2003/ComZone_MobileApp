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
                width="18"
                height="18"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M10.5751 11.9339H3.37539C2.3813 11.9339 1.57542 11.1281 1.57539 10.134L1.5752 3.38413C1.57517 2.38999 2.38106 1.58408 3.3752 1.58408H14.1748C15.1689 1.58408 15.9748 2.3895 15.9748 3.38364L15.9749 6.53408M2.02485 4.73396H15.5249M12.8249 10.1659L14.6656 8.33396M14.6656 8.33396L16.4249 10.0831M14.6656 8.33396L14.6656 12.4159"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
                NẠP TIỀN
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={tw`flex flex-col items-center px-5 border-l border-r`}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M4.50005 4.50008V7.65008M13.5 4.50008V7.65008M13.05 10.8001H14.85C15.5956 10.8001 16.2 10.1957 16.2 9.45008V3.15008C16.2 2.4045 15.5956 1.80008 14.85 1.80008H3.15005C2.40446 1.80008 1.80005 2.40449 1.80005 3.15008V9.45008C1.80005 10.1957 2.40446 10.8001 3.15005 10.8001H4.95005M6.45375 13.6543L8.99933 16.1999M8.99933 16.1999L11.3734 13.8258M8.99933 16.1999L8.99944 10.9932M10.8 6.30008C10.8 7.29419 9.99416 8.10008 9.00005 8.10008C8.00594 8.10008 7.20005 7.29419 7.20005 6.30008C7.20005 5.30597 8.00594 4.50008 9.00005 4.50008C9.99416 4.50008 10.8 5.30597 10.8 6.30008Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
                RÚT TIỀN
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={tw`flex flex-col items-center px-2`}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M5.15385 5.8H14.8462M5.15385 10.6H14.8462M2.8 1H17.2C18.1941 1 19 1.80589 19 2.8V19L16 17.2L13 19L10 17.2L7 19L4 17.2L1 19V2.8C1 1.80589 1.80589 1 2.8 1Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
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
