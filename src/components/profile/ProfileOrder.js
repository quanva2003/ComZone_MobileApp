import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import Svg, { Circle, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ProfileOrder = () => {
  const navigate = useNavigation();
  return (
    <View style={tw`bg-neutral-300 px-5 pt-3 pb-5 flex flex-col gap-2`}>
      <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>ĐƠN MUA</Text>
      <View style={tw`bg-white rounded-3xl w-full p-3 flex flex-col `}>
        <View style={tw`flex flex-row items-stretch justify-between `}>
          <TouchableOpacity
            onPress={() =>
              navigate.navigate("OrderManagement", {
                activeTab: "PENDING",
              })
            }
          >
            <View style={tw`flex flex-col items-center px-2`}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M15.33 5.8125H2.67004M10.875 8.625C9.319 8.625 7.125 8.625 7.125 8.625M15.375 6.18873V13.7812C15.375 14.6615 14.6615 15.375 13.7812 15.375H4.21875C3.33855 15.375 2.625 14.6615 2.625 13.7812V6.18873C2.625 5.94131 2.68261 5.69729 2.79326 5.47599L3.88837 3.28575C4.09085 2.8808 4.50474 2.625 4.95749 2.625H13.0425C13.4953 2.625 13.9091 2.8808 14.1116 3.28575L15.2067 5.47599C15.3174 5.69729 15.375 5.94131 15.375 6.18873Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
                Chờ xác nhận
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate.navigate("OrderManagement", {
                activeTab: "DELIVERING",
              })
            }
          >
            <View style={tw`flex flex-col items-center px-5 border-l border-r`}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M6.90517 12.3409C6.90517 13.3953 6.0715 14.25 5.0431 14.25C4.01471 14.25 3.18103 13.3953 3.18103 12.3409M6.90517 12.3409C6.90517 11.2865 6.0715 10.4318 5.0431 10.4318C4.01471 10.4318 3.18103 11.2865 3.18103 12.3409M6.90517 12.3409H11.0948M3.18103 12.3409H2.25V4.75C2.25 4.19772 2.69772 3.75 3.25 3.75H11.0948V12.3409M15.2845 12.3409C15.2845 13.3953 14.4508 14.25 13.4224 14.25C12.394 14.25 11.5603 13.3953 11.5603 12.3409M15.2845 12.3409C15.2845 11.2865 14.4508 10.4318 13.4224 10.4318C12.394 10.4318 11.5603 11.2865 11.5603 12.3409M15.2845 12.3409H15.75V8.52273L13.4224 6.13636H11.0948V12.3409M11.5603 12.3409H11.0948"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
                Đang giao hàng
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate.navigate("OrderManagement", {
                activeTab: "DELIVERED",
              })
            }
          >
            <View style={tw`flex flex-col items-center px-2`}>
              <Svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M8.6212 2.03542C8.77612 1.72151 9.22374 1.72151 9.37867 2.03542L11.3842 6.09901C11.4457 6.22367 11.5646 6.31007 11.7022 6.33006L16.1866 6.98168C16.533 7.03202 16.6714 7.45774 16.4207 7.70208L13.1757 10.8651C13.0762 10.9622 13.0307 11.102 13.0542 11.239L13.8203 15.7053C13.8795 16.0503 13.5173 16.3134 13.2075 16.1505L9.19647 14.0418C9.07343 13.9771 8.92644 13.9771 8.8034 14.0418L4.79239 16.1505C4.48254 16.3134 4.12041 16.0503 4.17958 15.7053L4.94562 11.239C4.96912 11.102 4.92369 10.9622 4.82415 10.8651L1.57918 7.70208C1.32851 7.45774 1.46683 7.03202 1.81325 6.98168L6.29769 6.33006C6.43525 6.31007 6.55417 6.22367 6.61569 6.09901L8.6212 2.03542Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={[{ fontFamily: "REM_bold" }, tw`text-md`]}>
                Đánh giá
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileOrder;
