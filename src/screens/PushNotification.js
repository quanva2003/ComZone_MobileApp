// src/screens/PushNotificationScreen.js

import { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { usePushNotifications } from "../utils/PushNotificationService"; // Import your custom hook

const PushNotificationScreen = () => {
  const { expoPushToken, channels, notification, schedulePushNotification } =
    usePushNotifications();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Your expo push token: {expoPushToken || "No token available"}</Text>
      <Text>{`Channels: ${
        channels?.length
          ? JSON.stringify(channels.map((c) => c.id))
          : "No channels available"
      }`}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification?.request?.content?.title || "No Title"}
        </Text>
        <Text>Body: {notification?.request?.content?.body || "No Body"}</Text>
        <Text>
          Data:
          {JSON.stringify(notification?.request?.content?.data) || "No Data"}
        </Text>
      </View>

      <Button
        title="Press to schedule a notification"
        onPress={schedulePushNotification}
      />
    </View>
  );
};

export default PushNotificationScreen;
