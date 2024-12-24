import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import SignInText from "@/components/login/signin.text";
import OTPTextInput from "react-native-otp-textinput";
// import { style } from "./style";
import { StyleSheet } from "react-native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import fonts from "@/themes/app.fonts";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { router, useLocalSearchParams } from "expo-router";
import { commonStyles } from "@/styles/common.style";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const toast = useToast();
  const { phoneNumber } = useLocalSearchParams();

  const handleSubmit = async () => {
    if (otp === "") {
      toast.show("Please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setLoader(true);
      const otpNumbers = `${otp}`;
      await axios
        .post(`http://192.168.43.97:8000/api/v1/verify-otp`, {
          phone_number: phoneNumber,
          otp: otpNumbers,
        })
        .then(async (res) => {
          setLoader(false);
          if (res.data.user.email === null) {
            router.push({
              pathname: "/(routes)/registration",
              params: { user: JSON.stringify(res.data.user) },
            });
            toast.show("Account verified!");
          } else {
            await AsyncStorage.setItem("accessToken", res.data.accessToken);
            router.push("/(tabs)/home");
          }
        })
        .catch((error) => {
          setLoader(false);
          toast.show("Something went wrong! please re check your otp!", {
            type: "danger",
            placement: "bottom",
          });
        });
    }
  };

  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <SignInText
            title={"OTP Verification"}
            subtitle={"Check your phone number for the otp!"}
          />
          <OTPTextInput
            handleTextChange={(code) => setOtp(code)}
            inputCount={4}
            textInputStyle={style.otpTextInput}
            tintColor={color.subtitle}
            autoFocus={false}
          />
          <View style={[external.mt_30]}>
            <Button
              title="Verify"
              onPress={() => handleSubmit()}
              disabled={loader}
            />
          </View>
          <View style={[external.mb_15]}>
            <View
              style={[
                external.pt_10,
                external.Pb_10,
                { flexDirection: "row", gap: 5, justifyContent: "center" },
              ]}
            >
              <Text style={[commonStyles.regularText]}>Not Received yet?</Text>
              <TouchableOpacity>
                <Text style={[style.signUpText, { color: "#000" }]}>
                  Resend it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}
export const style = StyleSheet.create({
  otpTextInput: {
    backgroundColor: color.lightGray,
    borderColor: color.lightGray,
    borderWidth: 0.5,
    borderRadius: 6,
    width: windowWidth(60),
    height: windowHeight(40),
    borderBottomWidth: 0.5,
    color: color.subtitle,
    textAlign: "center",
    fontSize: fontSizes.FONT22,
    marginTop: windowHeight(10),
  },
  signUpText: {
    ...commonStyles.mediumTextBlack12,
    fontFamily: fonts.bold,
    paddingHorizontal: 5,
  },
});