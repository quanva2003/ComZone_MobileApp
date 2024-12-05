import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import tw from "twrnc";
import { Badge, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from "../../context/CartContext";
const HeaderInfo = () => {
  const navigate = useNavigation();
  const { cartCount, fetchCartData } = useContext(CartContext);
  const [currentUser, setCurrentUser] = useState(null);
  const fetchCurrentUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log("Current User:", parsedUser);
      }
    } catch (error) {
      console.error("Error retrieving currentUser:", error);
    }
  };
  useEffect(() => {
    fetchCartData();
    fetchCurrentUser();
  }, []);
  return (
    <View style={tw`flex flex-row items-center justify-between`}>
      <View style={tw`flex flex-row gap-2 items-center`}>
        <Image
          source={{
            uri: currentUser?.avatar,
          }}
          style={tw`w-15 h-15 rounded-full border-2 border-white shadow-lg`}
        />
        <View style={tw`flex flex-col`}>
          <Text style={[tw`text-xs`, { fontFamily: "REM_thin" }]}>
            Xin chào,
          </Text>
          <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
            {currentUser?.name}
          </Text>
        </View>
      </View>
      <View style={tw`flex flex-row gap-2`}>
        <TouchableOpacity onPress={() => navigate.push("SignUp")}>
          <View style={[styles.shadowContainer, tw`p-2 rounded-full bg-white`]}>
            <Icon type="MaterialIcons" name="chat-bubble-outline" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate.push("SignUp")}>
          <View style={[styles.shadowContainer, tw`p-2 rounded-full bg-white`]}>
            <Icon type="MaterialIcons" name="notifications-none" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate.push("Cart")}>
          <View style={[styles.shadowContainer, tw`p-2 rounded-full bg-white`]}>
            <Icon type="MaterialIcons" name="shopping-cart" size={20} />
            {cartCount > 0 && (
              <Badge
                value={cartCount}
                badgeStyle={{ backgroundColor: "#232323" }}
                containerStyle={{ position: "absolute", top: -5, right: -5 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderInfo;
const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
