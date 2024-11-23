import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const SignIn = () => {
  const navigate = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/hcn-logo.png")}
          style={styles.imageHeader}
        />
        <Text style={styles.subHeader}>Đăng ký</Text>
      </View>

      <TextInput placeholder="Email" style={styles.input} />
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.buttonText}>Gửi mã xác thực</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ height: 1, width: 145, backgroundColor: "#000" }}></View>
        <Text style={styles.orText}>hoặc</Text>
        <View style={{ height: 1, width: 145, backgroundColor: "#000" }}></View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Image
          source={require("../../assets/gg-logo.png")}
          style={styles.icon}
        />
        <Text style={{ fontSize: 18, fontFamily: "REM_regular" }}>
          Đăng nhập với Google
        </Text>
      </TouchableOpacity>
      <View style={styles.formFooter}>
        <Text style={{ fontFamily: "REM_regular" }}>Đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigate.push("SignIn")}>
          <View style={styles.linkSignUp}>
            <Text style={{ fontFamily: "REM_thin" }}>Đăng nhập</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
  },
  imageHeader: {
    height: 100,
    width: 300,
  },
  subHeader: {
    fontSize: 20,
    color: "#9D9D9D",
    marginBottom: 20,
    fontFamily: "REM_regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  orText: {
    marginTop: 10,
    textAlign: "center",
    marginBottom: 17,
    marginHorizontal: 10,
    fontFamily: "REM_thinItalic",
  },
  input: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontFamily: "REM_thin",
  },
  inputPass: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    fontFamily: "REM_thin",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
  },
  forgot: {
    textAlign: "right",
    marginBottom: 10,
    fontFamily: "REM_regular",
    marginTop: 5,
  },
  signInButton: {
    borderRadius: 25,
    backgroundColor: "#9D9D9D",
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },

  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "REM",
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  linkSignUp: {
    marginLeft: 5,
  },
});

export default SignIn;
