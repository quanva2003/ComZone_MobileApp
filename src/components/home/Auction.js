import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  AppState,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import CurrencySplitter from "../../assistants/Spliter";
import CountDown from "react-native-countdown-component";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomCountDown from "../countdown/CustomCountdown";
import { privateAxios } from "../../middleware/axiosInstance";

const Auction = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigation();

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}auction`);
      console.log("res auction:", response.data);
      const auctionComics = response.data.filter(
        (auction) => auction.status === "ONGOING"
      );
      setOngoingAuctions(auctionComics);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAuctions();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={tw`bg-white rounded-lg shadow-sm py-4 px-2 mb-4 w-43 items-center mr-3`}
        onPress={() =>
          navigate.navigate("AuctionDetail", { auctionData: item })
        }
      >
        <Image
          source={{ uri: item.comics.coverImage }}
          style={tw`w-35 h-45 rounded-lg`}
        />
        <View style={tw`h-14`}>
          <Text
            style={[tw`text-sm mt-2 text-gray-800`, { fontFamily: "REM" }]}
            numberOfLines={2}
          >
            {item.comics.title}
          </Text>
        </View>
        <CustomCountDown
          endTime={new Date(item?.endTime).getTime()}
          auction={item}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`py-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View>
          <FlatList
            data={ongoingAuctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={tw`justify-start`}
            key="auction-list"
          />
        </View>
      )}
    </View>
  );
};

export default Auction;
