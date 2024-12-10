import React from "react";
import { View, Text, Button } from "react-native";
import { usePushNotifications } from "../utils/PushNotificationService";

const PushNotificationScreen = () => {
  const { notification, schedulePushNotification } = usePushNotifications();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>Last Notification:</Text>
      <Text>Title: {notification?.request?.content?.title || "None"}</Text>
      <Text>Body: {notification?.request?.content?.body || "None"}</Text>
      <Button
        title="Schedule Local Notification"
        onPress={schedulePushNotification}
      />
    </View>
  );
};

export default PushNotificationScreen;
