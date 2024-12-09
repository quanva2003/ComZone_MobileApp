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
import { useNavigation } from "@react-navigation/native";
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
        (auction) => auction.status === "ONGOING" || auction.status === "SUCCESSFUL"|| auction.status === "FAILED"
      );
      console.log("auctionComics", auctionComics);

      setOngoingAuctions(auctionComics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const renderItem = ({ item }) => {
    const endTime = new Date(item.endTime).getTime();

    return (
      <View
        style={tw`bg-white rounded-lg shadow-sm py-4 px-2 mb-4 w-43 items-center mx-2`}
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
        <CustomCountDown endTime={new Date(item?.endTime).getTime()} />
        <View style={tw`mt-3 flex items-center w-full`}>
          <TouchableOpacity
            style={tw`bg-black py-1 px-3 rounded-md `}
            onPress={() =>
              navigate.navigate("AuctionDetail", { auctionData: item })
            }
          >
            <Text style={[tw`text-white text-xs`, { fontFamily: "REM" }]}>
              XEM CHI TIẾT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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

          <View style={tw`items-center`}>
            <TouchableOpacity>
              <Text>Xem thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Auction;
