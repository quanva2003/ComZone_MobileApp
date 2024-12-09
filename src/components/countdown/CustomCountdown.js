import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

const CustomCountDown = ({ endTime, detail, onAuctionEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(0, endTime - Date.now())
  );
  const [auctionEnded, setAuctionEnded] = useState(false);

  const formatEndTime = (endTime) => {
    const date = new Date(endTime);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      weekday: "short",
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = Math.max(0, endTime - Date.now());
      setTimeRemaining(newTime);

      if (newTime === 0) {
        clearInterval(interval);
        setAuctionEnded(true);
        if (onAuctionEnd) {
          onAuctionEnd();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = String(Math.floor(totalSeconds / (3600 * 24))).padStart(
      2,
      "0"
    );
    const hours = String(
      Math.floor((totalSeconds % (3600 * 24)) / 3600)
    ).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );

    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return { days, hours, minutes, seconds };
  };

  const time = formatTime(timeRemaining);

  return (
    <View>
      {auctionEnded ? (
        <Text
          style={{
            fontFamily: "REM",
            fontSize: 20,
            paddingBottom: 10,
            color: "red",
            textAlign: "center",
          }}
        >
          Phiên đấu giá đã kết thúc vào {formatEndTime(endTime)}
        </Text>
      ) : (
        <Text
          style={[
            tw`text-base text-white`,
            { fontFamily: "REM_regular", color: detail ? "white" : "black" },
          ]}
        >
          Kết thúc sau: {detail && formatEndTime(endTime)}
        </Text>
      )}

      <View style={tw`flex-row items-center gap-1 mt-2 justify-center`}>
        <View style={tw`flex-col items-center gap-1`}>
          <View
            style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
          >
            <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
              {String(time.days)}
            </Text>
          </View>
          <Text
            style={[
              tw`text-xs text-white`,
              { fontFamily: "REM_bold", color: detail ? "white" : "black" },
            ]}
          >
            Ngày
          </Text>
        </View>
        <View style={tw`flex-col items-center gap-1`}>
          <View
            style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
          >
            <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
              {String(time.hours)}
            </Text>
          </View>
          <Text
            style={[
              tw`text-xs text-white`,
              { fontFamily: "REM_bold", color: detail ? "white" : "black" },
            ]}
          >
            Giờ
          </Text>
        </View>
        <View style={tw`flex-col items-center gap-1`}>
          <View
            style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
          >
            <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
              {String(time.minutes)}
            </Text>
          </View>
          <Text
            style={[
              tw`text-xs text-white`,
              { fontFamily: "REM_bold", color: detail ? "white" : "black" },
            ]}
          >
            Phút
          </Text>
        </View>
        <View style={tw`flex-col items-center gap-1`}>
          <View
            style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
          >
            <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
              {String(time.seconds)}
            </Text>
          </View>
          <Text
            style={[
              tw`text-xs text-white`,
              { fontFamily: "REM_bold", color: detail ? "white" : "black" },
            ]}
          >
            Giây
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomCountDown;
