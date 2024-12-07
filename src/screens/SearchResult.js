import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import tw from "twrnc";
import CurrencySplitter from "../assistants/Spliter";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const SearchResults = () => {
  const route = useRoute();
  const { results: initialResults, searchText: initialSearchText } =
    route.params; // Get initial search text and filtered comics
  const [searchText, setSearchText] = useState(initialSearchText || "");
  const [results, setResults] = useState(initialResults);
  const navigation = useNavigation();
  useEffect(() => {
    setSearchText(initialSearchText || "");
  }, [initialSearchText]);
  const handleSearch = async () => {
    console.log("Searching for:", searchText);
    const response = await axios.get(
      `${process.env.BASE_URL}comics/status/available`
    );
    console.log(response.data);

    const comics = response.data;

    const filteredComics = comics.filter((comic) =>
      comic.title.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log(filteredComics);

    setResults(filteredComics);
  };

  const handleChangeText = (text) => {
    setSearchText(text);
  };
  const renderItem = (item) => {
    if (!item || !item.coverImage) {
      return null;
    }

    return (
      <TouchableOpacity
        style={tw`mb-4`}
        onPress={() => navigation.navigate("ComicDetail", { comic: item })}
      >
        <View style={tw`bg-white rounded-lg`}>
          <Image
            source={{ uri: item.coverImage }}
            style={tw`w-full h-70 rounded-t-lg`}
          />
          <View style={tw`p-2`}>
            <Text
              style={[
                tw`text-sm font-bold text-gray-800`,
                { fontFamily: "REM_bold" },
              ]}
              numberOfLines={1}
            >
              {item.title || "Unknown Title"}
            </Text>
            <Text
              style={[tw`text-xs text-gray-500`, { fontFamily: "REM" }]}
              numberOfLines={1}
            >
              {item.sellerId?.name || "Unknown Seller"}
            </Text>
            <Text
              style={[
                tw`text-red-500 mt-2 text-base`,
                { fontFamily: "REM_bold" },
              ]}
              numberOfLines={1}
            >
              {item.price
                ? `${CurrencySplitter(item.price)}đ`
                : "Price not available"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={tw`bg-white text-center flex items-end px-2`}>
        <TouchableOpacity
          style={tw`absolute top-5.5 left-4 bg-gray-100 rounded-full p-2 z-10 shadow-lg`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View
          style={tw`flex flex-row items-center bg-gray-100 rounded-full px-4 py-3 shadow-md my-4 w-5/6`}
        >
          <TouchableOpacity style={tw`mr-3`} onPress={handleSearch}>
            <Icon type="MaterialIcons" name="search" size={20} />
          </TouchableOpacity>
          <TextInput
            value={searchText}
            onChangeText={handleChangeText}
            placeholder="Bạn đang tìm kiếm truyện gì?"
            style={[
              tw`flex-1 text-base text-gray-800`,
              { fontFamily: "REM_thin" },
            ]}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
      {results.length === 0 ? (
        <Text>No comics found for "{searchText}"</Text>
      ) : (
        <ScrollView contentContainerStyle={tw`p-4`}>
          <View style={tw`flex-row flex-wrap -mx-2`}>
            {results.map((item, index) => (
              <View key={index} style={tw`w-1/2 px-2`}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SearchResults;
