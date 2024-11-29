import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileOrder from "../components/profile/ProfileOrder";

const Profile = () => {
  const navigate = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log("Current Usera:", parsedUser);
      }
    } catch (error) {
      console.error("Error retrieving currentUser:", error);
    }
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <View>
      <View style={tw`p-5`}>
        <ProfileHeader currentUser={currentUser} />
      </View>
      <ProfileOrder />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
