import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileOrder from "../components/profile/ProfileOrder";
import ProfileAuction from "../components/profile/ProfileAuction";
import Svg, { Lineine, Path, Polyline } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { privateAxios } from "../middleware/axiosInstance";
import axios from "axios";
const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  console.log(process.env.BASE_URL);

  const handleLogout = async () => {
    try {
      console.log("base", process.env.BASE_URL);
      console.log("token", token);

      const response = await axios.post(`${process.env.BASE_URL}auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("re", response);

      // Assuming the logout API returns a success message
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("userId");

      // Use the navigation to redirect after logout
      navigation.navigate("SignIn");

      Alert.alert("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Error", "Something went wrong. Please try again.");
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      const storedToken = await AsyncStorage.getItem("token");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setCurrentUser(parsedUser);
        console.log("Current Usera:", parsedUser);
      }
    } catch (error) {
      console.error("Error retrieving currentUser:", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentUser();
    }, [])
  );
  return (
    <View>
      <View style={tw`p-5`}>
        <ProfileHeader currentUser={currentUser} />
      </View>
      <ProfileOrder />
      <ProfileAuction />
      <View style={tw`flex items-center mt-3`}>
        <TouchableOpacity
          style={tw`flex-row gap-2 py-2 px-20 rounded-lg bg-black items-center`}
          onPress={() => handleLogout()}
        >
          <MaterialIcons name="logout" size={24} color="white" />
          <Text style={[tw`text-lg text-white`, { fontFamily: "REM_bold" }]}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
