import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CurrencySplitter from "../assistants/Spliter";

const StarRating = ({ rating, setRating }) => {
  return (
    <View style={tw`flex-row`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={30}
            color={star <= rating ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeedbackSeller = ({ route, navigation }) => {
  const { item, userId } = route.params;
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);
  console.log(userId);
  console.log(item);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      presentationStyle: "fullScreen",
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
      // Bỏ mediaTypes vì không cần thiết nữa
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const removeImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
  };

  const submitFeedback = async () => {
    if (rating === 0) {
      alert("Vui lòng đánh giá số sao!");
      return;
    }

    if (!feedback.trim()) {
      alert("Vui lòng nhập nhận xét!");
      return;
    }

    setIsLoading(true);
    try {
      // Upload ảnh trước
      const formData = new FormData();
      images.forEach((uri, index) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("images", {
          uri: uri,
          name: filename || `image${index}.jpg`,
          type: type,
        });
      });

      // Gửi request upload ảnh
      const imageUploadResponse = await axios.post(
        `${process.env.BASE_URL}file/upload/multiple-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Lấy URLs của ảnh đã upload
      const imageUrls = imageUploadResponse.data.imageUrls;

      // Tạo payload cho feedback
      const payload = {
        user: userId,
        seller: item.items[0].comics.sellerId.id,
        rating: rating,
        comment: feedback,
        attachedImages: imageUrls,
        order: item.id,
        isFeedback: true,
      };

      // Gửi feedback
      const resFeedback = await axios.post(
        `${process.env.BASE_URL}seller-feedback`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật trạng thái đơn hàng
      const statusPayload = {
        order: item.id,
        isFeedback: true,
      };

      const resChangeStatus = await axios.patch(
        `${process.env.BASE_URL}orders/status/successful`,
        statusPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Đánh giá đã được gửi thành công!");
      navigation.navigate("OrderManagement", {
        refresh: true,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        "Có lỗi khi gửi đánh giá: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      alert("User is not authenticated. Please login.");
    }
  };

  React.useEffect(() => {
    fetchToken();
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {isLoading && (
        <View
          style={tw`absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-50 items-center justify-center`}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View style={tw`bg-black py-5 shadow-lg text-center`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-xl`,
            { fontFamily: "REM_bold" },
          ]}
        >
          ĐÁNH GIÁ NGƯỜI BÁN
        </Text>
      </View>

      <View style={tw`p-4`}>
        {item.items.map((item) => (
          <View key={item.id} style={tw`flex-row items-start mb-4`}>
            <Image
              source={{ uri: item.comics.coverImage }}
              style={tw`h-22 w-16 mr-4`}
            />
            <View style={tw`h-22 flex justify-between`}>
              <Text style={[tw`text-base w-[60%]`, { fontFamily: "REM_bold" }]}>
                {item.comics.title}
              </Text>
              <Text
                style={[tw`text-md w-[60%]`, { fontFamily: "REM_regular" }]}
              >
                {CurrencySplitter(item.comics.price)} đ
              </Text>
            </View>
          </View>
        ))}

        <View style={tw`mb-4`}>
          <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
            Đánh giá chất lượng
          </Text>
          <StarRating rating={rating} setRating={setRating} />
        </View>

        <View style={tw`mb-4`}>
          <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
            Nhận xét về người bán
          </Text>
          <TextInput
            style={[
              tw`border border-gray-300 p-2 h-24 rounded-lg`,
              {
                textAlignVertical: "top",
                paddingTop: 8,
              },
            ]}
            multiline
            placeholder="Chia sẻ những điều bạn thích về sản phẩm và người bán"
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        <View style={tw`mb-4`}>
          <TouchableOpacity
            style={tw`bg-gray-100 p-3 rounded-lg`}
            onPress={pickImage}
          >
            <Text style={[tw`text-center`, { fontFamily: "REM" }]}>
              Thêm hình ảnh
            </Text>
          </TouchableOpacity>
          <ScrollView horizontal style={tw`mt-2`}>
            {images.map((uri) => (
              <View key={uri} style={tw`mr-2 relative`}>
                <Image source={{ uri }} style={tw`w-20 h-20 rounded-lg`} />
                <TouchableOpacity
                  style={tw`absolute top-0 right-0 bg-red-500 rounded-full p-1`}
                  onPress={() => removeImage(uri)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={tw`bg-black p-4 rounded-lg`}
          onPress={submitFeedback}
        >
          <Text
            style={[
              tw`text-white text-center text-lg`,
              { fontFamily: "REM_bold" },
            ]}
          >
            Gửi đánh giá
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FeedbackSeller;
