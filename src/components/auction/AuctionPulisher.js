import React from "react";
import { View, Text, ScrollView } from "react-native";

import tw from "twrnc";

const AuctionPublisher = ({ comic }) => {
  return (
    <ScrollView
      style={tw`w-full bg-white p-4 rounded-md border border-gray-300`}
    >
      <Text style={[tw`text-sm pb-2`, { fontFamily: "REM_bold" }]}>
        Thông tin chi tiết
      </Text>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Thể loại
        </Text>
        <View style={tw`w-1/2 flex-wrap flex-row justify-end`}>
          {comic.genres?.map((genre, index) => (
            <Text
              key={index}
              style={[
                tw`text-sky-800`,
                { fontFamily: "REM_bold", textAlign: "right" },
              ]}
            >
              {genre.name}
              {index < comic.genres.length - 1 && ", "}
            </Text>
          ))}
        </View>
      </View>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Tác giả
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.author}
        </Text>
      </View>

      <View style={tw`w-full flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Phiên bản truyện
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.edition.name}
        </Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Tình trạng
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.condition.name} ({comic.condition.value}/10)
        </Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Mô tả tình trạng
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.condition.description}
        </Text>
      </View>

      {comic?.page && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Số trang
          </Text>
          <Text
            style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
          >
            {comic.page}
          </Text>
        </View>
      )}

      {comic?.publicationYear && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Năm phát hành
          </Text>
          <Text
            style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
          >
            {comic.publicationYear}
          </Text>
        </View>
      )}

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Truyện lẻ / Bộ truyện
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic?.quantity === 1 ? "Truyện lẻ" : "Bộ truyện"}
        </Text>
      </View>

      {comic?.quantity > 1 && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Số lượng cuốn
          </Text>
          <Text
            style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
          >
            {comic?.quantity}
          </Text>
        </View>
      )}

      {comic?.quantity > 1 && comic.episodesList && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Tên tập, số tập:
          </Text>
          <View style={tw`w-1/2 flex-row flex-wrap justify-end gap-2`}>
            {comic.episodesList.map((eps, index) => (
              <Text
                key={index}
                style={tw`px-2 py-1 rounded-md border border-gray-300 text-right`}
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
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Phụ kiện đính kèm
          </Text>
          <View style={tw`w-1/2 flex-row flex-wrap justify-end gap-2`}>
            {comic.merchandises.map((mer, index) => (
              <Text
                key={index}
                style={tw`px-2 py-1 rounded-md border border-gray-300 text-right`}
              >
                {mer.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Bìa
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.cover === "SOFT"
            ? "Bìa mềm"
            : comic.cover === "HARD"
            ? "Bìa cứng"
            : "Bìa rời"}
        </Text>
      </View>

      <View style={tw`flex-row items-center py-2 border-b`}>
        <Text
          style={[
            tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
            { fontFamily: "REM" },
          ]}
        >
          Màu sắc
        </Text>
        <Text
          style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
        >
          {comic.color === "GRAYSCALE" ? "Đen trắng" : "Có màu"}
        </Text>
      </View>

      {comic.originCountry && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Xuất xứ
          </Text>
          <Text
            style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
          >
            {comic.originCountry}
          </Text>
        </View>
      )}

      {(comic.length || comic.width || comic.thickness) && (
        <View style={tw`flex-row items-center py-2 border-b`}>
          <Text
            style={[
              tw`w-1/2 text-gray-600 text-xs sm:text-sm`,
              { fontFamily: "REM" },
            ]}
          >
            Kích thước
          </Text>
          <Text
            style={[tw`w-1/2`, { fontFamily: "REM_bold", textAlign: "right" }]}
          >
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
