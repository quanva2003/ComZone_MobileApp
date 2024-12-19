import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { privateAxios } from "../middleware/axiosInstance";

const AddNewAddress = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    detailedAddress: "",
    isDefault: false,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [error, setError] = useState(null);

  // New state for modal visibility
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [wardModalVisible, setWardModalVisible] = useState(false);

  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await privateAxios.get("/viet-nam-address/provinces");
      console.log("province:", response.data);

      setProvinces(response.data);
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to fetch provinces.");
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      setLoadingDistricts(true);
      const response = await privateAxios.get(
        `/viet-nam-address/districts/${provinceId}`
      );
      setDistricts(response.data);
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to fetch districts.");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      setLoadingWards(true);
      const response = await privateAxios.get(
        `/viet-nam-address/wards/${districtCode}`
      );
      setWards(response.data);
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to fetch wards.");
    } finally {
      setLoadingWards(false);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const currentUserJson = await AsyncStorage.getItem("currentUser");
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);

        // Pre-fill form data with user's name and phone
        setFormData((prevData) => ({
          ...prevData,
          fullName: currentUser.fullName || currentUser.name || "",
          phone: currentUser.phone || currentUser.phoneNumber || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  useEffect(() => {
    fetchCurrentUser();
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectProvince) {
      fetchDistricts(selectProvince.id);
      // Reset district and ward selections when province changes
      setSelectDistrict(null);
      setSelectWard(null);
    }
  }, [selectProvince]);

  useEffect(() => {
    if (selectDistrict) {
      fetchWards(selectDistrict.id);
      // Reset ward selection when district changes
      setSelectWard(null);
    }
  }, [selectDistrict]);

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.detailedAddress ||
      !selectProvince ||
      !selectDistrict ||
      !selectWard
    ) {
      Alert.alert(
        "Chưa đầy đủ thông tin liên hệ",
        "Vui lòng điền đầy đủ thông tin liên hệ để chúng tôi có thể tiến hành giao hàng cho bạn. Cảm ơn bạn đã cung cấp thông tin!"
      );
      return;
    }

    const addressData = {
      fullName: formData.fullName,
      phone: formData.phone,
      province: selectProvince?.id,
      district: selectDistrict?.id,
      ward: selectWard?.id,
      detailedAddress: formData.detailedAddress,
      isDefault: formData.isDefault,
    };
    console.log("address data", addressData);

    setLoading(true);

    try {
      await privateAxios.post("/user-addresses", addressData);
      Alert.alert("Thành công", "Thêm địa chỉ mới thành công!");
      navigation.goBack();
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", "Failed to add the address. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phone &&
      formData.detailedAddress &&
      selectProvince &&
      selectDistrict &&
      selectWard
    );
  };
  const renderLocationModal = (
    title,
    data,
    loading,
    modalVisible,
    setModalVisible,
    onSelect
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white w-11/12 rounded-lg max-h-[70%]`}>
          <View style={tw`bg-black p-4 rounded-t-lg`}>
            <Text
              style={[
                tw`text-white text-center text-lg`,
                { fontFamily: "REM_bold" },
              ]}
            >
              {title}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={tw`my-4`} />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-4 border-b border-gray-200`}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[tw`text-base`, { fontFamily: "REM_regular" }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            style={tw`p-4 bg-gray-100`}
            onPress={() => setModalVisible(false)}
          >
            <Text
              style={[tw`text-center text-black`, { fontFamily: "REM_bold" }]}
            >
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-black py-5 shadow-lg`}>
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
          Thêm địa chỉ mới
        </Text>
      </View>

      <View style={tw`flex-1 p-4`}>
        <Text style={[tw`text-base mb-2`, { fontFamily: "REM_bold" }]}>
          Liên hệ
        </Text>
        <TextInput
          style={[
            tw`bg-white p-2 mb-4 rounded-lg`,
            { fontFamily: "REM_regular", color: "#000" },
          ]}
          placeholder="Nhập họ và tên"
          placeholderTextColor="#a9a9a9"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        <TextInput
          style={[
            tw`bg-white p-2 mb-4 rounded-lg`,
            { fontFamily: "REM_regular", color: "#000" },
          ]}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#a9a9a9"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />

        <Text style={[tw`text-base mb-2`, { fontFamily: "REM_bold" }]}>
          Địa chỉ
        </Text>
        {/* Province */}
        <TouchableOpacity onPress={() => setProvinceModalVisible(true)}>
          <TextInput
            style={[
              tw`bg-white p-2 mb-4 rounded-lg`,
              { fontFamily: "REM_regular", color: "#000" },
            ]}
            placeholder="Chọn Tỉnh/Thành phố"
            value={selectProvince ? selectProvince.name : ""}
            editable={false}
          />
        </TouchableOpacity>

        {/* District */}
        <TouchableOpacity
          onPress={() => setDistrictModalVisible(true)}
          disabled={!selectProvince}
        >
          <TextInput
            style={[
              tw`bg-white p-2 mb-4 rounded-lg`,
              {
                fontFamily: "REM_regular",
                color: selectProvince ? "#000" : "#a9a9a9",
              },
            ]}
            placeholder="Chọn Quận/Huyện"
            value={selectDistrict ? selectDistrict.name : ""}
            editable={false}
          />
        </TouchableOpacity>

        {/* Ward */}
        <TouchableOpacity
          onPress={() => setWardModalVisible(true)}
          disabled={!selectDistrict}
        >
          <TextInput
            style={[
              tw`bg-white p-2 mb-4 rounded-lg`,
              {
                fontFamily: "REM_regular",
                color: selectDistrict ? "#000" : "#a9a9a9",
              },
            ]}
            placeholder="Chọn Phường/Xã"
            value={selectWard ? selectWard.name : ""}
            editable={false}
          />
        </TouchableOpacity>

        <TextInput
          style={[
            tw`bg-white p-2 mb-4 rounded-lg`,
            { fontFamily: "REM_regular", color: "#000" },
          ]}
          placeholder="Tên đường, số nhà"
          value={formData.detailedAddress}
          onChangeText={(text) =>
            setFormData({ ...formData, detailedAddress: text })
          }
        />

        {/* Default Address Option */}
        <TouchableOpacity
          style={tw`flex-row items-center gap-2 mb-4`}
          onPress={() =>
            setFormData({ ...formData, isDefault: !formData.isDefault })
          }
        >
          <View
            style={[
              tw`w-6 h-6 rounded border-2 flex items-center justify-center`, // Center the tick icon
              formData.isDefault
                ? tw`bg-black border-black`
                : tw`border-gray-400`,
            ]}
          >
            {formData.isDefault && (
              <Ionicons name="checkmark" size={20} color="white" /> // Display the checkmark icon when isDefault is true
            )}
          </View>
          <Text style={[tw`text-base`, { fontFamily: "REM_regular" }]}>
            Đặt làm địa chỉ mặc định
          </Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <TouchableOpacity
            style={[
              tw`bg-black py-3 rounded-lg`,
              { opacity: isFormValid() ? 1 : 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid()}
          >
            <Text
              style={[
                tw`text-center text-white text-lg`,
                { fontFamily: "REM_bold" },
              ]}
            >
              Lưu địa chỉ
            </Text>
          </TouchableOpacity>
        )}

        {error && (
          <Text style={tw`text-red-500 text-center mt-4`}>{error}</Text>
        )}
      </View>

      {/* Modals for Province, District, and Ward Selection */}
      {renderLocationModal(
        "Chọn Tỉnh/Thành phố",
        provinces,
        loadingProvinces,
        provinceModalVisible,
        setProvinceModalVisible,
        (province) => {
          setSelectProvince(province);
          // Reset subsequent selections
          setSelectDistrict(null);
          setSelectWard(null);
        }
      )}

      {renderLocationModal(
        "Chọn Quận/Huyện",
        districts,
        loadingDistricts,
        districtModalVisible,
        setDistrictModalVisible,
        (district) => {
          setSelectDistrict(district);
          // Reset subsequent selections
          setSelectWard(null);
        }
      )}

      {renderLocationModal(
        "Chọn Phường/Xã",
        wards,
        loadingWards,
        wardModalVisible,
        setWardModalVisible,
        setSelectWard
      )}
    </View>
  );
};

export default AddNewAddress;
