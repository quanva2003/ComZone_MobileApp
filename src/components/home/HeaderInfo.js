import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const HeaderInfo = (currentUser) => {
  const navigate = useNavigation();
  return (
    <View style={tw`flex flex-row items-center justify-between`}>
      <View style={tw`flex flex-row gap-2 items-center`}>
        <Image
          source={{
            uri: currentUser.currentUser?.avatar,
          }}
          style={tw`w-15 h-15 rounded-full border-2 border-white shadow-lg`}
        />
        <View style={tw`flex flex-col`}>
          <Text style={[tw`text-xs`, { fontFamily: "REM_thin" }]}>
            Xin chào,
          </Text>
          <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
            {currentUser.currentUser?.name}
          </Text>
        </View>
      </View>
      <View style={tw`flex flex-row gap-2`}>
        <TouchableOpacity onPress={() => navigate.push("SignUp")}>
          <View style={[styles.shadowContainer, tw`p-2 rounded-full bg-white`]}>
            <Icon type="MaterialIcons" name="swap-horiz" size={20} />
          </View>
        </TouchableOpacity>
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
