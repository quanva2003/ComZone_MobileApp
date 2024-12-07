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
import CustomCountDown from "../components/countdown/CustomCountdown";
import HeaderInfo from "../components/home/HeaderInfo";
import { Icon } from "react-native-elements"; // Assuming you're using react-native-elements

const Auction = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigation();

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}auction`);
      const auctionComics = response.data.filter(
        (auction) => auction.status === "ONGOING"
      );
      setOngoingAuctions(auctionComics);
      setFilteredAuctions(auctionComics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleChangeText = (text) => {
    setSearchText(text);
    // Filter auctions based on comic title
    const filtered = ongoingAuctions.filter((auction) =>
      auction.comics.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAuctions(filtered);
  };

  const handleSearch = () => {
    // Optional: Add any additional search logic if needed
    const filtered = ongoingAuctions.filter((auction) =>
      auction.comics.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAuctions(filtered);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={tw`bg-white rounded-lg shadow-sm py-4 px-1 mb-4 w-43 items-center`}
      >
        <Image
          source={{ uri: item.comics.coverImage }}
          style={tw`w-40 h-60  rounded-lg`}
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
              navigate.navigate("AuctionDetail", { auction: item })
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
        <View style={tw`mt-5 pb-60`}>
          <FlatList
            data={filteredAuctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={tw`justify-start gap-2`}
            key="auction-list"
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

export default Auction;
