import React, { useContext, useEffect, useRef, useState } from "react";
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
import ComicsOfSeller from "../components/comicDetail/ComicsOfSeller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import FeedbackSection from "../components/comicDetail/FeedbackSection";
import { getComicsCondition } from "../common/constances/comicsConditions";

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

const ComicDetail = ({ route }) => {
  const navigation = useNavigation();
  const { comic } = route.params;
  console.log("comic", comic);

  const allImages = [comic.coverImage, ...comic.previewChapter];
  const [currentImage, setCurrentImage] = useState(comic.coverImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [token, setToken] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const scrollViewRef = useRef(null);
  const { addToCart, cartCount } = useContext(CartContext);
  console.log(process.env.BASE_URL);

  const checkIfInCart = async () => {
    const cart = await getCart();
    setIsInCart(cart.some((item) => item.id === comic.id));
  };
  const updateCartCount = async () => {
    const cart = await getCart();
    setCartCount(cart.length);
  };
  const handleAddToCart = async () => {
    const cart = await getCart();
    if (!cart.some((item) => item.id === comic.id)) {
      cart.push(comic);
      await saveCart(cart);
      setIsInCart(true);
      setModalVisible(true);
      addToCart(comic);
    }
  };

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  };
  const fetchFeedbacks = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `${process.env.BASE_URL}seller-feedback/seller/some/${comic.sellerId.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setFeedbacks(response.data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    }
  };

  useEffect(() => {
    setCurrentImage(comic.coverImage);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    (async () => {
      await checkIfInCart();
      // await updateCartCount();
      await fetchFeedbacks();
      setLoading(false);
    })();
  }, [comic]);
  useEffect(() => {
    fetchToken();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
      <TouchableOpacity
        onPress={() => navigation.push("Cart")}
        style={tw`absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow`}
      >
        <View style={tw`relative`}>
          <Icon type="MaterialIcons" name="shopping-cart" size={24} />
          {cartCount > 0 && (
            <View
              style={tw`absolute -top-3 -right-4 bg-[#232323] rounded-full w-5 h-5 flex items-center justify-center`}
            >
              <Text style={tw`text-white text-xs`}>{cartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
            {comic.title}
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontFamily: "REM" }}>của</Text>
            <Image
              source={{ uri: comic.sellerId.avatar }}
              style={tw`rounded-full w-6 h-6`}
            />
            <Text style={{ fontFamily: "REM_semiBoldItalic" }}>
              {comic.sellerId.name}
            </Text>
          </View>
          <Text
            style={[
              tw`text-lg text-red-500 text-3xl my-3`,
              { fontFamily: "REM_bold" },
            ]}
          >
            {CurrencySplitter(comic.price)} đ
          </Text>
          <View style={tw`flex-row gap-3 justify-between`}>
            {/* Add to Cart */}
            <TouchableOpacity
              style={tw`flex-1`}
              onPress={handleAddToCart}
              disabled={isInCart}
            >
              <View
                style={tw`flex-row gap-2 border-2 rounded-lg p-3 justify-center ${
                  isInCart ? "bg-emerald-700" : ""
                }`}
              >
                <Icon
                  type="MaterialIcons"
                  name="shopping-cart"
                  size={20}
                  color={isInCart && "white"}
                />
                <Text
                  style={[
                    { fontFamily: "REM" },
                    tw`${isInCart ? "text-white" : "text-black"}`,
                  ]}
                >
                  {isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Buy Now */}
            <TouchableOpacity
              style={tw`flex-1`}
              onPress={() => {
                console.log("comic", [comic]);

                navigation.navigate("Checkout", {
                  selectedComics: [comic],
                });
              }}
            >
              <View style={tw`bg-black rounded-lg p-3.7 items-center`}>
                <Text style={[tw`text-white`, { fontFamily: "REM" }]}>
                  Mua ngay
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={tw`px-4 py-2`}>
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            Mô tả nội dung
          </Text>
          <Text style={[tw`text-sm mt-2`, { fontFamily: "REM_italic" }]}>
            {comic.description}
          </Text>
        </View>

        {/* New Section: Detailed Information */}
        <View
          style={tw`w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl `}
        >
          <Text style={[tw`text-base pb-2`, { fontFamily: "REM_bold" }]}>
            Thông tin chi tiết
          </Text>

          <View
            style={tw`w-full flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Thể loại
            </Text>
            <View style={tw`flex flex-row`}>
              {comic.genres?.map((genre, index) => (
                <Text
                  key={index}
                  style={[tw`text-sky-800`, { fontFamily: "REM_regular" }]}
                >
                  {genre.name}
                  {index < comic.genres.length - 1 && ", "}
                </Text>
              ))}
            </View>
          </View>

          <View
            style={tw`w-full flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text
              style={[tw`w-1/2 text-gray-600`, { fontFamily: "REM_regular" }]}
            >
              Tác giả
            </Text>
            <Text style={[{ fontFamily: "REM_regular" }]}>{comic.author}</Text>
          </View>

          <View
            style={tw`w-full flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Phiên bản truyện
            </Text>
            <Text style={[, { fontFamily: "REM_regular" }]}>
              {comic.edition.name}
            </Text>
          </View>

          <View
            style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Tình trạng
            </Text>
            <Text style={[tw``, { fontFamily: "REM_regular" }]}>
              {comic.condition.name}
            </Text>
          </View>

          {comic.page && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Số trang
              </Text>
              <Text style={[{ fontFamily: "REM_regular" }]}>{comic.page}</Text>
            </View>
          )}

          {comic.publicationYear && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Năm phát hành
              </Text>
              <Text style={[{ fontFamily: "REM_regular" }]}>
                {comic.publicationYear}
              </Text>
            </View>
          )}

          <View
            style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Truyện lẻ / Bộ truyện
            </Text>
            <Text style={[{ fontFamily: "REM_regular" }]}>
              {comic.quantity === 1 ? "Truyện lẻ" : "Bộ truyện"}
            </Text>
          </View>

          {comic.quantity > 1 && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Số lượng cuốn
              </Text>
              <Text style={[{ fontFamily: "REM_regular" }]}>
                {comic.quantity}
              </Text>
            </View>
          )}

          {comic.quantity > 1 && comic.episodesList && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Tên tập, số tập:
              </Text>
              <View
                style={tw`flex flex-row items-center justify-start gap-2 flex-wrap`}
              >
                {comic.episodesList.map((eps, index) => (
                  <Text
                    key={index}
                    style={tw`px-2 py-1 rounded-md border border-gray-300`}
                  >
                    {/^[0-9]*$/.test(eps) && "Tập "}
                    {eps}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {comic.merchandises.length > 0 && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Phụ kiện đính kèm
              </Text>
              <View
                style={tw`flex-row flex items-center justify-start gap-2 flex-wrap`}
              >
                {comic.merchandises.map((mer, index) => (
                  <Text
                    key={index}
                    style={tw`px-2 py-1 rounded-md border border-gray-300`}
                  >
                    {mer.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          <View
            style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Bìa
            </Text>
            <Text style={[{ fontFamily: "REM_regular" }]}>
              {comic.cover === "SOFT"
                ? "Bìa mềm"
                : comic.cover === "HARD"
                ? "Bìa cứng"
                : "Bìa rời"}
            </Text>
          </View>

          <View
            style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
          >
            <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
              Màu sắc
            </Text>
            <Text style={[{ fontFamily: "REM_regular" }]}>
              {comic.color === "GRAYSCALE" ? "Đen trắng" : "Có màu"}
            </Text>
          </View>

          {comic.originCountry && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Xuất xứ
              </Text>
              <Text style={[{ fontFamily: "REM_regular" }]}>
                {comic.originCountry}
              </Text>
            </View>
          )}

          {(comic.length || comic.width || comic.thickness) && (
            <View
              style={tw`flex flex-row items-center justify-between text-xs py-2 border-b`}
            >
              <Text style={[tw` text-gray-600`, { fontFamily: "REM_regular" }]}>
                Kích thước
              </Text>
              <Text style={[{ fontFamily: "REM_regular" }]}>
                {`${comic.length} x ${comic.width} x ${comic.thickness} (cm)`}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={tw`px-6 py-2`}>
        <FeedbackSection feedbacks={feedbacks} />
      </View>
      {/* Seller's Other Comics */}
      <View style={tw`px-6 py-2`}>
        <ComicsOfSeller seller={comic.sellerId} />
      </View>

      {/* Confirmation Modal */}
      <Modal
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
      </Modal>
    </ScrollView>
  );
};

export default ComicDetail;
