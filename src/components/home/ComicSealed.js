import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import CurrencySplitter from "../../assistants/Spliter";
import { useNavigation } from "@react-navigation/native";

const ComicSealed = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const fetchComics = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:3000/comics/status/available"
      );
      console.log(response);

      setComics(response.data.slice(0, 20));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comics:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComics();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`mr-4`}
      onPress={() => navigation.navigate("ComicDetail", { comic: item })}
    >
      <View style={tw`bg-white rounded-lg w-30`}>
        <Image
          source={{ uri: item.coverImage }}
          style={tw`w-30 h-40 rounded-t-lg`}
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
            {item.sellerId.name}
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
    <View style={tw`py-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={comics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row`}
        />
      )}
    </View>
  );
};

export default ComicSealed;
