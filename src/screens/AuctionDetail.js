import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import CurrencySplitter from "../assistants/Spliter";
import { Icon } from "react-native-elements";
// import ComicsOfSeller from "../components/AuctionDetail/ComicsOfSeller";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Utility functions for cart management
const getCart = async () => {
  try {
    const cartData = await AsyncStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Failed to get cart:", error);
    return [];
  }
};

const saveCart = async (cart) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};

const AuctionDetail = ({ route }) => {
  const navigation = useNavigation();
  const { auction } = route.params;
  console.log("auction", auction);
  console.log("asdasd", auction.comics.coverImage);

  const allImages = [
    auction.comics.coverImage,
    ...auction.comics.previewChapter,
  ];
  console.log("all", allImages);

  const [currentImage, setCurrentImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setCurrentImage(auction.comics.coverImage);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [auction]);

  //   if (loading) {
  //     return (
  //       <View style={tw`flex-1 justify-center items-center`}>
  //         <ActivityIndicator size="large" color="#000" />
  //       </View>
  //     );
  //   }

  return (
    <ScrollView style={tw`flex-1`} ref={scrollViewRef}>
      {/* Back Button */}
      <TouchableOpacity
        style={tw`absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow`}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Cart Button */}

      {/* Current Image */}
      <View style={tw`relative`}>
        <Image source={{ uri: currentImage }} style={tw`w-full h-100 mb-4`} />
        <View
          style={tw`absolute bottom-7 left-2 bg-white px-2 py-1 rounded-full border border-gray-300`}
        >
          <Text style={tw`text-black text-sm`}>
            {allImages.indexOf(currentImage) + 1} / {allImages.length}
          </Text>
        </View>
      </View>

      {/* Thumbnail Navigator */}
      <View style={tw`mb-4`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row justify-center`}
        >
          {allImages.map((url, index) => (
            <TouchableOpacity
              key={index}
              style={tw`mr-2`}
              onPress={() => setCurrentImage(url)}
            >
              <Image
                source={{ uri: url }}
                style={tw.style(
                  `w-16 h-16 rounded-xl`,
                  url === currentImage ? `border-2 border-gray-800` : `border-2`
                )}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Comic Details */}
      <View style={tw`p-2`}>
        <View style={tw`bg-white py-2 px-4 rounded-lg`}>
          <Text style={[tw`text-xl mb-2`, { fontFamily: "REM_bold" }]}>
            {auction.comics.title}
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontFamily: "REM" }}>của</Text>
            <Image
              source={{ uri: auction.comics.sellerId.avatar }}
              style={tw`rounded-full w-6 h-6`}
            />
            <Text style={{ fontFamily: "REM_semiBoldItalic" }}>
              {auction.comics.sellerId.name}
            </Text>
          </View>
          {/* <Text
            style={[
              tw`text-lg text-red-500 text-3xl my-3`,
              { fontFamily: "REM_bold" },
            ]}
          >
            {CurrencySplitter(comic.price)} đ
          </Text> */}
          {/* <View style={tw`flex-row gap-3 justify-between`}>
            <TouchableOpacity
              style={tw`flex-1`}
              onPress={addToCart}
              disabled={isInCart}
            >
              <View
                style={tw`flex-row gap-2 border-2 rounded-lg p-3 justify-center ${
                  isInCart && "bg-emerald-700"
                }`}
              >
                <Icon type="MaterialIcons" name="shopping-cart" size={20} />
                <Text style={{ fontFamily: "REM" }}>
                  {isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={tw`flex-1`}>
              <View style={tw`bg-black rounded-lg p-3.7 items-center`}>
                <Text style={[tw`text-white`, { fontFamily: "REM" }]}>
                  Mua ngay
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Description */}
        <View style={tw`px-4 py-2`}>
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            Mô tả nội dung
          </Text>
          <Text style={[tw`text-sm mt-2`, { fontFamily: "REM_italic" }]}>
            {auction.comics.description}
          </Text>
        </View>
      </View>

      {/* Seller's Other Comics */}
      {/* <View style={tw`px-6 py-2`}>
        <ComicsOfSeller seller={comic.sellerId} />
      </View> */}

      {/* Confirmation Modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-white p-4 rounded-lg`}>
            <Text style={tw`text-center text-xl font-bold`}>
              Truyện đã được thêm vào giỏ hàng!
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`mt-4 bg-black p-2 rounded-lg`}
            >
              <Text style={tw`text-white text-center`}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default AuctionDetail;
