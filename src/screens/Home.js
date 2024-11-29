import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList, // Import FlatList instead of ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import HeaderInfo from "../components/home/HeaderInfo";
import ComicSealed from "../components/home/ComicSealed";
import Auction from "../components/home/Auction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const navigate = useNavigation();
  const [searchText, setSearchText] = useState("");
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
    fetchCurrentUser();
  }, []);

  const data = [
    { type: "header" },
    { type: "search" },
    {
      type: "section",
      title: "Truyện tranh nguyên seal",
      component: ComicSealed,
    },
    {
      type: "section",
      title: "Sản phẩm đang được đấu giá",
      component: Auction,
    },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "header":
        return <HeaderInfo currentUser={currentUser} />;
      case "search":
        return (
          <View
            style={tw`flex flex-row items-center bg-gray-100 rounded-full px-4 py-3 shadow-lg mt-4`}
          >
            <TouchableOpacity style={tw`mr-3`}>
              <Icon type="MaterialIcons" name="search" size={20} />
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Bạn đang tìm kiếm truyện gì?"
              style={[
                tw`flex-1 text-base text-gray-800`,
                { fontFamily: "REM_thin" },
              ]}
            />
          </View>
        );
      case "section":
        return (
          <View>
            <View style={tw`flex flex-row items-center justify-between mt-4`}>
              <Text style={[tw`text-lg`, { fontFamily: "REM_regular" }]}>
                {item.title}
              </Text>
              <TouchableOpacity>
                <Icon type="MaterialIcons" name="more-horiz" />
              </TouchableOpacity>
            </View>
            <item.component />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={tw`p-5`}
    />
  );
};

export default Home;

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
