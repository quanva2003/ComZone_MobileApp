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
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { privateAxios } from "../middleware/axiosInstance";

const EditAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addressId, fullName, phone, isDefault } = route.params;

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
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [error, setError] = useState(null);

  // Modal visibility states
  const [provinceModalVisible, setProvinceModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [wardModalVisible, setWardModalVisible] = useState(false);

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await privateAxios.get("/viet-nam-address/provinces");
      setProvinces(response.data);
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to fetch provinces.");
    } finally {
      setLoadingProvinces(false);
    }
  };

  // Fetch districts for a specific province
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

  // Fetch wards for a specific district
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

  // Fetch existing address details
  const fetchAddressDetails = async () => {
    try {
      setLoadingInitial(true);
      const response = await privateAxios.get(
        `/user-addresses/address-name/${addressId}`
      );
      const addressData = response.data;
      console.log("address:", addressData);

      // Set form data
      setFormData({
        fullName: fullName,
        phone: phone,
        detailedAddress: addressData.detailedAddress,
        isDefault: isDefault,
      });

      // Set selected location
      setSelectProvince({
        id: addressData.province.id,
        name: addressData.province.name,
      });

      // Trigger district fetch
      await fetchDistricts(addressData.province.id);
      setSelectDistrict({
        id: addressData.district.id,
        name: addressData.district.name,
      });

      // Trigger ward fetch
      await fetchWards(addressData.district.id);
      setSelectWard({
        id: addressData.ward.id,
        name: addressData.ward.name,
      });
    } catch (error) {
      setError(error.message);
      Alert.alert("Error", "Failed to fetch address details.");
    } finally {
      setLoadingInitial(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    Promise.all([fetchProvinces(), fetchAddressDetails()]);
  }, []);

  // Update districts when province changes
  useEffect(() => {
    if (selectProvince) {
      fetchDistricts(selectProvince.id);
      setSelectDistrict(null);
      setSelectWard(null);
    }
  }, [selectProvince]);

  // Update wards when district changes
  useEffect(() => {
    if (selectDistrict) {
      fetchWards(selectDistrict.id);
      setSelectWard(null);
    }
  }, [selectDistrict]);

  // Form submission handler
  const handleSubmit = async () => {
    // Validation checks
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
        "Vui lòng điền đầy đủ thông tin liên hệ."
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
    console.log("add", addressData);

    setLoading(true);

    try {
      // Update address
      await privateAxios.patch(`/user-addresses/${addressId}`, addressData);

      // If set as default, call the default address endpoint
      if (formData.isDefault) {
        await privateAxios.patch(`/user-addresses/default/${addressId}`);
      }

      Alert.alert("Thành công", "Địa chỉ đã được cập nhật.");
      navigation.goBack();
    } catch (err) {
      setError(err.message);
      Alert.alert("Lỗi", "Không thể cập nhật địa chỉ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    // Confirm deletion with user
    Alert.alert("Xóa địa chỉ", "Bạn có chắc chắn muốn xóa địa chỉ này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            // Delete address using API
            await privateAxios.delete(`/user-addresses/${addressId}`);
            navigation.goBack();
            // Show success alert
            Alert.alert("Thành công", "Địa chỉ đã được xóa.");
          } catch (err) {
            // Handle deletion error
            setError(err.message);
            Alert.alert("Lỗi", "Không thể xóa địa chỉ. Vui lòng thử lại.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  // Form validation helper
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

  // Render location selection modal
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

  // If initial loading, show loading indicator
  if (loadingInitial) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

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
          Chỉnh sửa địa chỉ
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
              tw`w-6 h-6 rounded border-2 flex items-center justify-center`,
              formData.isDefault
                ? tw`bg-black border-black`
                : tw`border-gray-400`,
            ]}
          >
            {formData.isDefault && (
              <Ionicons name="checkmark" size={20} color="white" />
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
              Lưu thay đổi
            </Text>
          </TouchableOpacity>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <TouchableOpacity
            style={[
              tw`bg-white py-2 rounded-lg border border-red-600 mt-3`,
              { opacity: isFormValid() ? 1 : 0.6 },
            ]}
            onPress={handleDelete}
            // disabled={!isFormValid()}
          >
            <Text
              style={[
                tw`text-center text-red-600 text-lg`,
                { fontFamily: "REM_bold" },
              ]}
            >
              Xóa địa chỉ
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
        setSelectProvince
      )}
      {renderLocationModal(
        "Chọn Quận/Huyện",
        districts,
        loadingDistricts,
        districtModalVisible,
        setDistrictModalVisible,
        setSelectDistrict
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

export default EditAddress;
