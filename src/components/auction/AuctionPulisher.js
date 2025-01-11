import React from "react";
import { View, Text, ScrollView } from "react-native";

import tw from "twrnc";

const AuctionPublisher = ({ comic }) => {
  return (
    <ScrollView
      style={tw`w-full bg-white p-4 rounded-md border border-gray-300`}
    >
      <Text style={tw`text-sm pb-2`}>Thông tin chi tiết</Text>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>Thể loại</Text>
        <View style={tw`w-1/2 flex-wrap flex-row`}>
          {comic.genres?.map((genre, index) => (
            <Text key={index} style={tw`text-sky-800`}>
              {genre.name}
              {index < comic.genres.length - 1 && ", "}
            </Text>
          ))}
        </View>
      </View>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>Tác giả</Text>
        <Text style={tw`w-1/2`}>{comic.author}</Text>
      </View>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
          Phiên bản truyện
        </Text>
        <Text style={tw`w-1/2`}>{comic.edition.name}</Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
          Tình trạng
        </Text>
        <Text style={tw`w-1/2`}>
          {comic.condition.name} ({comic.condition.value}/10)
        </Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
          Mô tả tình trạng
        </Text>
        <Text style={tw`w-1/2`}>{comic.condition.description}</Text>
      </View>

      {comic?.page && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Số trang
          </Text>
          <Text style={tw`w-1/2`}>{comic.page}</Text>
        </View>
      )}

      {comic?.publicationYear && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Năm phát hành
          </Text>
          <Text style={tw`w-1/2`}>{comic.publicationYear}</Text>
        </View>
      )}

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
          Truyện lẻ / Bộ truyện
        </Text>
        <Text style={tw`w-1/2`}>
          {comic?.quantity === 1 ? "Truyện lẻ" : "Bộ truyện"}
        </Text>
      </View>

      {comic?.quantity > 1 && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Số lượng cuốn
          </Text>
          <Text style={tw`w-1/2`}>{comic?.quantity}</Text>
        </View>
      )}

      {comic?.quantity > 1 && comic.episodesList && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Tên tập, số tập:
          </Text>
          <View style={tw`w-1/2 flex-row flex-wrap gap-2`}>
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
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Phụ kiện đính kèm
          </Text>
          <View style={tw`w-1/2 flex-row flex-wrap gap-2`}>
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

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>Bìa</Text>
        <Text style={tw`w-1/2`}>
          {comic.cover === "SOFT"
            ? "Bìa mềm"
            : comic.cover === "HARD"
            ? "Bìa cứng"
            : "Bìa rời"}
        </Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>Màu sắc</Text>
        <Text style={tw`w-1/2`}>
          {comic.color === "GRAYSCALE" ? "Đen trắng" : "Có màu"}
        </Text>
      </View>

      {comic.originCountry && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Xuất xứ
          </Text>
          <Text style={tw`w-1/2`}>{comic.originCountry}</Text>
        </View>
      )}

      {(comic.length || comic.width || comic.thickness) && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text style={tw`w-1/2 text-gray-600 text-xs sm:text-sm`}>
            Kích thước
          </Text>
          <Text style={tw`w-1/2`}>
            {`${comic.length || "-"} x ${comic.width || "-"} x ${
              comic.thickness || "-"
            } (cm)`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AuctionPublisher;
