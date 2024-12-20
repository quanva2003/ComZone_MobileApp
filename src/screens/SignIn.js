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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SignIn = () => {
  const navigate = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const logInGoogle = async () => {
    axios.get(`${process.env.BASE_URL}auth/google/login`);
  };
  console.log("url", process.env.BASE_URL);
  const logInAccount = async () => {
    await AsyncStorage.removeItem("token", token);

    const responseLogin = await axios.post(
      `${process.env.BASE_URL}auth/login`,
      {
        email,
        password,
      }
    );

    const token = responseLogin.data.accessToken;
    console.log("token1", token);

    await AsyncStorage.setItem("userId", responseLogin.data.id);
    await AsyncStorage.setItem("token", token);
    console.log("Login Successful, Token Saved");
    if (token) {
      const responseUserInfo = await axios.get(
        `${process.env.BASE_URL}users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User Profile:", responseUserInfo.data);
      const userInfo = responseUserInfo.data;
      await AsyncStorage.setItem("currentUser", JSON.stringify(userInfo));
      navigate.push("Main");
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/square-logo.png")}
          style={styles.imageHeader}
        />
        <Text style={styles.subHeader}>Đăng nhập</Text>
      </View>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          style={styles.inputPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={styles.iconContainer}
        >
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.forgot}>Quên mật khẩu?</Text>
      <TouchableOpacity style={styles.signInButton} onPress={logInAccount}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.formFooter}>
        <Text style={{ fontFamily: "REM_regular" }}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigate.push("SignUp")}>
          <View style={styles.linkSignUp}>
            <Text style={{ fontFamily: "REM_thin" }}>Tạo tài khoản mới</Text>
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
    height: 150,
    width: 150,
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
    fontFamily: "REM_regular",
  },
  inputPass: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    fontFamily: "REM_regular",
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
