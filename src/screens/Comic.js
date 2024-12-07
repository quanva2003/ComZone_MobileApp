import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import HeaderInfo from "../components/home/HeaderInfo";
import { Icon } from "react-native-elements"; // Assuming you're using react-native-elements
import CurrencySplitter from "../assistants/Spliter";

const Comic = () => {
  const [comics, setComics] = useState([]);
  const [filteredComics, setFilteredComics] = useState([]); // State for filtered comics
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const fetchComics = async () => {
    try {
      const response = await axios.get(
        `${process.env.BASE_URL}comics/status/available`
      );
      console.log(response.data);

      setComics(response.data);
      setFilteredComics(response.data); // Initialize filtered comics
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComics();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (!text) {
      // Reset the filtered list if search text is cleared
      setFilteredComics(comics);
      return;
    }

    // Ensure text is always treated as a string before calling toLowerCase()
    const query = String(text); // Explicitly convert text to a string
    const filtered = comics.filter((comic) =>
      comic.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredComics(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`mb-4`}
      onPress={() => navigation.navigate("ComicDetail", { comic: item })}
    >
      <View style={tw`bg-white rounded-lg w-42`}>
        <Image
          source={{ uri: item.coverImage }}
          style={tw`w-42 h-64 rounded-t-lg`}
        />
        <View style={tw`p-2`}>
          <Text
            style={[
              tw`text-sm font-bold text-gray-800`,
              { fontFamily: "REM_bold" },
            ]}
            numberOfLines={1}
          >
            {item.title}
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
            {CurrencySplitter(item.price)}đ
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`p-5`}>
      <HeaderInfo />

      {/* Search Box */}
      <View
        style={tw`flex flex-row items-center bg-gray-100 rounded-full px-4 py-3 shadow-lg mt-4`}
      >
        <TouchableOpacity style={tw`mr-3`}>
          <Icon type="MaterialIcons" name="search" size={20} />
        </TouchableOpacity>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Bạn đang tìm kiếm truyện gì?"
          style={[
            tw`flex-1 text-base text-gray-800`,
            { fontFamily: "REM_thin" },
          ]}
          onSubmitEditing={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={tw`mt-5 pb-60 flex items-center`}>
          <FlatList
            data={filteredComics}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={tw`justify-start gap-5`}
            key="comic-list"
            ListEmptyComponent={
              <View style={tw`items-center justify-center mt-10`}>
                <Text style={[tw`text-gray-500`, { fontFamily: "REM" }]}>
                  Không tìm thấy truyện phù hợp
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default Comic;
