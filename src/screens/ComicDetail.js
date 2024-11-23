// src/screens/ComicDetail.js

import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import tw from "twrnc";
import CurrencySplitter from "../assistants/Spliter";
import { Icon } from "react-native-elements";

const ComicDetail = ({ route }) => {
  const navigation = useNavigation();
  const { comic } = route.params;
  const allImages = [comic.coverImage, ...comic.previewChapter];
  const [currentImage, setCurrentImage] = useState(comic.coverImage);
  const currentIndex = allImages.indexOf(currentImage) + 1;
  return (
    <ScrollView style={tw`flex-1`}>
      <TouchableOpacity
        style={tw`absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow`}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={tw`relative`}>
        <Image source={{ uri: currentImage }} style={tw`w-full h-100 mb-4`} />
        <View
          style={tw`absolute bottom-7 left-2 bg-white px-2 py-1 rounded-full border border-gray-300`}
        >
          <Text style={tw`text-black text-sm`}>
            {currentIndex} / {allImages.length}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-center mb-4`}>
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
                url === currentImage ? `border-2 border-gray-800` : `border-2 `
              )}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={tw`p-2`}>
        <View style={tw` bg-white py-2 px-4 rounded-lg`}>
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
            <TouchableOpacity style={tw`flex-1`}>
              <View
                style={tw`flex-row gap-2 border-2 border-black rounded-lg p-3 justify-center`}
              >
                <Icon type="MaterialIcons" name="shopping-cart" size={20} />
                <Text style={{ fontFamily: "REM" }}>Thêm vào giỏ hàng</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1`}>
              <View style={tw`bg-black rounded-lg p-3.6 items-center`}>
                <Text style={[tw`text-white`, { fontFamily: "REM" }]}>
                  Mua ngay
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`px-4 py-2`}>
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            Mô tả nội dung
          </Text>
          <Text style={[tw`text-sm mt-2`, { fontFamily: "REM_italic" }]}>
            {comic.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ComicDetail;
