import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { NotificationContext } from "../../context/NotificationContext";
import { privateAxios } from "../../middleware/axiosInstance";

const AuctionNotification = ({ auctionId, userId, onWinnerUpdate }) => {
  const {
    auctionAnnounce,
    markAuctionAnnounceAsRead,
    fetchUnreadAnnouncementForAuction,
  } = useContext(NotificationContext);
  console.log("AuctionNotification", auctionAnnounce);

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    if (auctionAnnounce) {
      markAuctionAnnounceAsRead();
      onWinnerUpdate(auctionAnnounce.status === "SUCCESSFUL");
    }
    setModalVisible(false);
  };

  useEffect(() => {
    fetchUnreadAnnouncementForAuction(auctionId);
  }, [auctionId]);

  useEffect(() => {
    if (
      auctionAnnounce &&
      auctionAnnounce.auction.id === auctionId &&
      !auctionAnnounce.isRead
    ) {
      setModalVisible(true);
    }
  }, [auctionAnnounce]);

  return (
    <View>
      {/* Modal */}
      {auctionAnnounce && auctionAnnounce.auction.id === auctionId && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose} // Corrected function call
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display auction title */}
              <Text
                style={[
                  tw`text-xl mb-2`,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    color:
                      auctionAnnounce?.status === "SUCCESSFUL"
                        ? "green"
                        : "red",
                  },
                ]}
              >
                {auctionAnnounce?.title}
              </Text>

              {/* Render notifications */}

              <View style={[tw`bg-white `]}>
                <Text
                  style={[
                    tw`text-lg mb-2`,
                    {
                      textAlign: "center",
                      lineHeight: 24,
                      color: "#333",
                    },
                  ]}
                >
                  {auctionAnnounce?.message}
                </Text>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={tw`mt-4 py-2 px-4 bg-red-500 rounded-full`}
                onPress={handleModalClose} // Corrected function call
              >
                <Text style={tw`text-white text-center font-bold`}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AuctionNotification;
