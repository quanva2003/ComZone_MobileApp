import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import Svg, { Line, Path } from "react-native-svg";
import { CheckBox, Stack } from "react-native-elements";
const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedComics, setSelectedComics] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const loadCartData = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      const parsedCart = cartData ? JSON.parse(cartData) : [];

      setCart(parsedCart);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const calculateTotalPrice = () => {
    const selectedComicIds = Object.keys(selectedComics);
    const total = cart
      .filter((comic) => selectedComicIds.includes(comic.id.toString()))
      .reduce((acc, comic) => acc + comic.price, 0);
    setTotalPrice(total);
  };
  useEffect(() => {
    loadCartData();
  }, []);
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedComics]);
  const groupBySeller = (comics) => {
    return comics.reduce((grouped, comic) => {
      const sellerId = comic.sellerId.id;
      if (!grouped[sellerId]) {
        grouped[sellerId] = {
          seller: comic.sellerId,
          comics: [],
        };
      }
      grouped[sellerId].comics.push(comic);
      return grouped;
    }, {});
  };

  const groupedComics = groupBySeller(cart);

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      setSelectedComics({});
      setIsAllSelected(false);
    } else {
      // Select all
      const allComics = {};
      Object.values(groupedComics).forEach((sellerGroup) => {
        sellerGroup.comics.forEach((comic) => {
          allComics[comic.id] = true;
        });
      });
      setSelectedComics(allComics);
      setIsAllSelected(true);
    }
  };

  const handleComicSelect = (comicId) => {
    const updatedSelectedComics = { ...selectedComics };
    if (updatedSelectedComics[comicId]) {
      delete updatedSelectedComics[comicId];
    } else {
      updatedSelectedComics[comicId] = true;
    }
    setSelectedComics(updatedSelectedComics);

    // Update all selected status
    const allComicsCount = cart.length;
    const selectedComicsCount = Object.keys(updatedSelectedComics).length;
    setIsAllSelected(allComicsCount === selectedComicsCount);
  };

  const handleSellerSelect = (sellerId) => {
    const sellerComics = groupedComics[sellerId].comics;
    const updatedSelectedComics = { ...selectedComics };

    let allSelected = true;
    sellerComics.forEach((comic) => {
      if (!updatedSelectedComics[comic.id]) {
        allSelected = false;
      }
    });

    sellerComics.forEach((comic) => {
      if (allSelected) {
        delete updatedSelectedComics[comic.id];
      } else {
        updatedSelectedComics[comic.id] = true;
      }
    });

    setSelectedComics(updatedSelectedComics);

    const allComicsCount = cart.length;
    const selectedComicsCount = Object.keys(updatedSelectedComics).length;
    setIsAllSelected(allComicsCount === selectedComicsCount);
  };

  const handleEditSeller = (sellerId) => {
    setEditingSeller(editingSeller === sellerId ? null : sellerId); // Toggle edit mode for the seller
  };

  const handleDeleteComic = (comicId) => {
    const updatedCart = cart.filter((comic) => comic.id !== comicId);
    setCart(updatedCart);
    AsyncStorage.setItem("cart", JSON.stringify(updatedCart)); // Update AsyncStorage
  };

  const handleCheckout = () => {
    const selectedComicsList = cart.filter(
      (comic) => selectedComics[comic.id.toString()]
    );
    {
      selectedComicsList.length > 0
        ? navigation.navigate("Checkout", {
            selectedComics: selectedComicsList,
          })
        : Alert.alert(
            "Bạn cần chọn ít nhất 1 quyển truyện để tiến hành thanh toán"
          );
    }
  };

  return (
    <View style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`bg-black py-5 shadow-lg text-center`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-2xl `,
            { fontFamily: "REM_bold" },
          ]}
        >
          GIỎ HÀNG
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={tw`flex-1 p-4`}>
        {Object.keys(groupedComics).length === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-xl font-bold`}>Giỏ hàng của bạn trống</Text>
          </View>
        ) : (
          Object.keys(groupedComics).map((sellerId) => {
            const seller = groupedComics[sellerId].seller;
            const comics = groupedComics[sellerId].comics;

            return (
              <View key={sellerId} style={tw`mb-6 bg-white rounded-lg`}>
                <View
                  style={tw`flex-row items-center p-2 border-b justify-between`}
                >
                  <TouchableOpacity
                    onPress={() => handleSellerSelect(sellerId)}
                    style={tw`flex-row items-center`}
                  >
                    <Image
                      source={{ uri: seller.avatar }}
                      style={tw`w-10 h-10 rounded-full mr-2`}
                    />
                    <Text
                      style={[
                        tw`text-xl`,
                        { fontFamily: "REM_bold", maxWidth: "80%" },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {seller.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditSeller(sellerId)}>
                    <Text
                      style={[tw`text-sky-700`, { fontFamily: "REM_regular" }]}
                    >
                      {editingSeller === sellerId ? "Hủy" : "Sửa"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {comics.map((comic) => (
                  <View key={comic.id} style={tw`items-center flex-row`}>
                    <TouchableOpacity
                      key={comic.id}
                      onPress={() => handleComicSelect(comic.id)}
                      style={[
                        tw`flex mt-2 flex-row items-center p-2 border-b border-gray-100`,
                        selectedComics[comic.id] && tw`bg-gray-300 rounded-lg`,
                        {
                          borderWidth: 1,
                          borderColor: selectedComics[comic.id]
                            ? "black"
                            : "transparent",
                        },
                        editingSeller === sellerId && tw`w-5/6`,
                      ]}
                    >
                      <Image
                        source={{ uri: comic.coverImage }}
                        style={tw`w-16 h-24 rounded-md mr-4`}
                      />
                      <View style={tw`flex-1`}>
                        <Text
                          style={[tw` text-lg`, { fontFamily: "REM_regular" }]}
                          numberOfLines={2}
                        >
                          {comic.title}
                        </Text>
                        <Text
                          style={[tw`text-xl mt-2`, { fontFamily: "REM_bold" }]}
                        >
                          {comic.price.toLocaleString()} đ
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {editingSeller === sellerId && (
                      <TouchableOpacity
                        onPress={() => handleDeleteComic(comic.id)}
                        style={tw`ml-auto p-3 mt-2`}
                      >
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ff0000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-trash-2"
                        >
                          <Path d="M3 6h18" />
                          <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <Line x1="10" x2="10" y1="11" y2="17" />
                          <Line x1="14" x2="14" y1="11" y2="17" />
                        </Svg>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Footer */}
      <View style={tw` bg-white flex flex-row items-center `}>
        <TouchableOpacity
          style={tw`flex-row items-center w-1/6`}
          onPress={handleSelectAll}
        >
          <CheckBox
            checked={isAllSelected}
            checkedColor={"#000000"}
            onPress={handleSelectAll}
          />
          <Text style={[tw`text-sm -ml-4`, { fontFamily: "REM_bold" }]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <View style={tw`flex flex-col pl-4 w-3/6 items-end pr-2`}>
          <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>
            Tổng thanh toán :
          </Text>
          <Text style={[tw`text-xl`, { fontFamily: "REM_bold" }]}>
            {totalPrice.toLocaleString()} đ
          </Text>
        </View>
        <TouchableOpacity
          style={tw`bg-black py-4 px-4 justify-center items-center w-2/6`}
          onPress={handleCheckout}
        >
          <Text
            style={[tw`text-white text-center`, { fontFamily: "REM_bold" }]}
          >
            MUA HÀNG
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
