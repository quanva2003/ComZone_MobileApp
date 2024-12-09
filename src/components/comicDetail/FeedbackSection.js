import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import tw from "twrnc";
import { Icon } from "react-native-elements";

const StarRating = ({ rating }) => {
  return (
    <View style={tw`flex-row`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          type="MaterialIcons"
          name="star"
          size={20}
          color={star <= rating ? "#FFD700" : "#E0E0E0"}
        />
      ))}
    </View>
  );
};

const FeedbackSection = ({ feedbacks }) => {
  console.log("feedbacks:", feedbacks);

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <View style={tw`py-4`}>
        <Text style={[tw`text-lg text-center`, { fontFamily: "REM_bold" }]}>
          Chưa có đánh giá
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`py-4`}>
      <Text style={[tw`text-lg mb-4`, { fontFamily: "REM_bold" }]}>
        Đánh giá từ độc giả
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {feedbacks.feedback.map((feedback, index) => (
          <View
            key={index}
            style={tw`bg-white rounded-lg p-4 mr-4 w-80 border border-gray-200`}
          >
            <View style={tw`flex-row items-center mb-2`}>
              <Image
                source={{ uri: feedback.user.avatar }}
                style={tw`w-10 h-10 rounded-full mr-3`}
              />
              <View>
                <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
                  {feedback.user.name}
                </Text>
                <StarRating rating={feedback.rating} />
              </View>
            </View>
            <Text style={[tw`text-sm mb-2`, { fontFamily: "REM" }]}>
              {feedback.comment}
            </Text>
            {feedback.attachedImages && feedback.attachedImages.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`mt-2`}
              >
                {feedback.attachedImages.map((imageUrl, imageIndex) => (
                  <Image
                    key={imageIndex}
                    source={{ uri: imageUrl }}
                    style={tw`w-40 h-40 rounded-lg mr-2`}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeedbackSection;
