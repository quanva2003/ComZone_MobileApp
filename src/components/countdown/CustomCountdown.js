import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

const CustomCountDown = ({ endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(0, endTime - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = Math.max(0, endTime - Date.now());
      setTimeRemaining(newTime);

      if (newTime === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return { hours, minutes, seconds };
  };
  const time = formatTime(timeRemaining);

  return (
    <View style={tw`flex-row items-center gap-3 mt-2`}>
      <View style={tw`flex-col items-center gap-2`}>
        <View
          style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
        >
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            {String(time.hours)}
          </Text>
        </View>
        <Text style={[tw`text-xs text-white`, { fontFamily: "REM_bold" }]}>
          Giờ
        </Text>
      </View>
      <View style={tw`flex-col items-center gap-2`}>
        <View
          style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
        >
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            {String(time.minutes)}
          </Text>
        </View>
        <Text style={[tw`text-xs text-white`, { fontFamily: "REM_bold" }]}>
          Phút
        </Text>
      </View>
      <View style={tw`flex-col items-center gap-2`}>
        <View
          style={tw`p-1 bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-between`}
        >
          <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
            {String(time.seconds)}
          </Text>
        </View>
        <Text style={[tw`text-xs text-white`, { fontFamily: "REM_bold" }]}>
          Giây
        </Text>
      </View>
      {/* <Text style={tw`text-lg text-gray-800`}>{formatTime(timeRemaining)}</Text> */}
    </View>
  );
};

export default CustomCountDown;
