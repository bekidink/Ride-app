import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import { commonStyles } from "@/styles/common.style";
import { external } from "@/styles/external.style";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import fonts from "@/themes/app.fonts";
import { StyleSheet } from "react-native";
import Images from "@/utils/images";
import SignInText from "@/components/login/signin.text";
import PhoneNumberInput from "@/components/login/phone-number.input";
import Button from "@/components/common/button";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
export default function index() {
  const [phone_number, setphone_number] = useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = useState("+880");
  const toast = useToast();

  const handleSubmit = async () => {
    if (phone_number === "" || countryCode === "") {
      toast.show("Please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setloading(true);
      const phoneNumber = `+${countryCode}${phone_number}`;
      console.log(phoneNumber);
      await axios
        .post(`http://192.168.43.97:8000/api/v1/registration`, {
          phone_number: phoneNumber,
        })
        .then((res) => {
          setloading(false);
          router.push({
            pathname: "/(routes)/otp-verification",
            params: { phoneNumber },
          });
        })
        .catch((error) => {
          console.log(error);
          setloading(false);
          toast.show(
            "Something went wrong! please re check your phone number!",
            {
              type: "danger",
              placement: "bottom",
            }
          );
        });
    }
  };
  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <View>
              <Image style={styles.transformLine} source={Images.line} />
              <SignInText />
              <View style={[external.mt_25, external.Pb_10]}>
                <PhoneNumberInput
                  phone_number={phone_number}
                  setphone_number={setphone_number}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                />
                <View style={[external.mt_25, external.Pb_15]}>
                  <Button
                    title="Get Otp"
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}
export const styles = StyleSheet.create({
  transformLine: {
    transform: [{ rotate: "-90deg" }],
    height: windowHeight(50),
    width: windowWidth(120),
    position: "absolute",
    left: windowWidth(-50),
    top: windowHeight(-20),
  },
  countryCodeContainer: {
    width: windowWidth(69),
  },
  phoneNumberInput: {
    width: windowWidth(326),
    height: windowHeight(39),
    backgroundColor: color.lightGray,
    borderRadius: 4,
    marginHorizontal: windowHeight(9),
    justifyContent: "center",
    paddingHorizontal: windowHeight(9),
    borderWidth: 1,
    borderColor: color.border,
  },
  rememberMeText: {
    fontWeight: "400",
    fontFamily: fonts.medium,
    fontSize: fontSizes.FONT16,
    color: color.primaryText,
  },
  forgotPasswordText: {
    fontWeight: "400",
    fontFamily: fonts.medium,
    color: color.buttonBg,
    fontSize: fontSizes.FONT16,
  },
  newUserContainer: {
    ...external.fd_row,
    ...external.ai_center,
    ...external.mt_12,
    ...external.as_center,
  },
  newUserText: {
    ...commonStyles.regularText,
  },
  signUpText: {
    ...commonStyles.mediumTextBlack12,
    fontFamily: fonts.bold,
    paddingHorizontal: windowHeight(4),
  },
  rememberTextView: {
    ...external.fd_row,
    ...external.ai_center,
    ...external.mt_5,
    ...external.js_space,
  },
});
