import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Assuming you have these imports
import { privateAxios } from "../middleware/axiosInstance";
import Svg, { Path } from "react-native-svg";

const TransactionHistory = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetchUserTransactions = async () => {
    try {
      const response = await privateAxios.get(`/transactions/user`, {
        params: { userId },
      });
      const data = await response.data;
      console.log("Transactions fetched:", data);

      const getNote = (transaction) => {
        if (transaction.type === "SUBTRACT") {
          if (transaction.order) return `Thanh toán đơn hàng`;
          if (transaction.exchange) return `Thanh toán trao đổi`;
          if (transaction.deposit?.exchange) return `Tiền cọc trao đổi`;
          if (transaction.deposit?.auction) return `Tiền cọc đấu giá`;
          if (transaction.sellerSubscription) return `Mua gói bán ComZone`;
          if (transaction.withdrawal) return `Rút tiền về tài khoản ngân hàng`;
          return "Thông tin giao dịch không có sẵn";
        }
        if (transaction.type === "ADD") {
          if (transaction.order) return `Nhận tiền đơn hàng`;
          if (transaction.exchange) return `Thanh toán tiền bù trao đổi`;
          if (transaction.deposit?.exchange) return `Hoàn trả cọc`;
          if (transaction.deposit?.auction) {
            return transaction.deposit.status === "REFUNDED"
              ? `Hoàn trả cọc đấu giá`
              : transaction.deposit.status === "SEIZED"
              ? `Hoàn trả cọc đấu giá do người dùng không thanh toán`
              : "Thông tin giao dịch không có sẵn";
          }
          if (transaction.walletDeposit) return "Nạp tiền vào ví";
          return "Thông tin giao dịch không có sẵn";
        }
        return "Thông tin giao dịch không có sẵn";
      };
      const formatDate = (dateString) => {
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        return new Date(dateString).toLocaleString("vi-VN", options);
      };
      const formattedTransactions = data.map((transaction) => ({
        code: transaction.code,
        createdAt: formatDate(transaction.createdAt),
        type: transaction.type,
        amount: transaction.amount.toLocaleString("vi-VN"),
        status: transaction.status,
        note: getNote(transaction),
      }));
      console.log("aa", formattedTransactions);

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false); // Ensure loading state is false after the operation completes
    }
  };

  const fetchUserInfo = async () => {
    const res = await privateAxios("/users/profile");
    setUserInfo(res.data);
  };
  useEffect(() => {
    fetchUserInfo();
    fetchUserTransactions();
  }, []);
  console.log("user info", userInfo);

  const renderTransactionItem = ({ item }) => (
    <View style={tw`flex-row justify-between p-4 border-b border-gray-200`}>
      <View style={tw`flex-1 flex-row items-center`}>
        <View
          style={tw`p-2 bg-white h-8 w-8 rounded-full shadow-md flex items-center`}
        >
          {item.type === "ADD" ? (
            <Svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M10.5751 13.9339H3.37539C2.3813 13.9339 1.57542 13.1281 1.57539 12.134L1.5752 5.38413C1.57517 4.38999 2.38106 3.58408 3.3752 3.58408H14.1748C15.1689 3.58408 15.9748 4.3895 15.9748 5.38364L15.9749 8.53408M2.02485 6.73396H15.5249M12.8249 12.1659L14.6656 10.334M14.6656 10.334L16.4249 12.0831M14.6656 10.334L14.6656 14.4159"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          ) : (
            <Svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M4.50005 4.50011V7.65011M13.5 4.50011V7.65011M13.05 10.8001H14.85C15.5956 10.8001 16.2 10.1957 16.2 9.45011V3.15011C16.2 2.40453 15.5956 1.80011 14.85 1.80011H3.15005C2.40446 1.80011 1.80005 2.40453 1.80005 3.15011V9.45011C1.80005 10.1957 2.40446 10.8001 3.15005 10.8001H4.95005M6.45375 13.6544L8.99933 16.1999M8.99933 16.1999L11.3734 13.8259M8.99933 16.1999L8.99944 10.9932M10.8 6.30011C10.8 7.29422 9.99416 8.10011 9.00005 8.10011C8.00594 8.10011 7.20005 7.29422 7.20005 6.30011C7.20005 5.306 8.00594 4.50011 9.00005 4.50011C9.99416 4.50011 10.8 5.306 10.8 6.30011Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          )}
        </View>
        <View style={tw`ml-3`}>
          <Text style={[{ fontFamily: "REM_bold" }, tw`text-base`]}>
            {item.note}
          </Text>
          <Text
            style={[{ fontFamily: "REM_regular" }, tw`text-xs text-gray-400`]}
          >
            {item.createdAt}
          </Text>
          <Text
            style={[
              { fontFamily: "REM_regular" },
              tw`text-xs mt-1 ${
                item.status === "SUCCESSFUL"
                  ? "text-green-600"
                  : item.status === "PENDING"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`,
            ]}
          >
            {item.status === "SUCCESSFUL"
              ? "Thành công"
              : item.status === "PENDING"
              ? "Đang xử lý"
              : "Thất bại"}
          </Text>
        </View>
      </View>
      <Text
        style={[
          { fontFamily: "REM_bold" },
          tw`text-base ${
            item.type === "ADD" ? "text-green-600" : "text-red-500"
          }`,
        ]}
      >
        {item.type === "ADD" ? "+" : "-"}
        {item.amount} đ
      </Text>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <View style={tw`bg-black py-5 shadow-lg items-center`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-2xl `,
            { fontFamily: "REM_bold" },
          ]}
        >
          LỊCH SỬ VÍ
        </Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={tw`flex-1 justify-center items-center`}
        />
      ) : transactions.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Text style={[{ fontFamily: "REM_regular" }, tw`text-gray-500`]}>
            Không có giao dịch
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.code}
        />
      )}
    </View>
  );
};

export default TransactionHistory;
