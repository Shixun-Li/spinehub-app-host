import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React from "react";
import MainButton from "@/components/core/main-button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AppText from "@/components/core/app-text";
import { components } from "@/backend-sdk/schema";
import { COLORS } from "@/constants/theme";
import { formatDOB } from "@/utils/formator";

type Props = {
  user: components["schemas"]["UserPayloadDto"];
  onSubmit: () => void;
};

const UserDetailsStep = ({ user, onSubmit }: Props) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <View>
          <View style={{ gap: 10, paddingBottom: 20 }}>
            <AppText fontWeight="semiBold" size={24}>
              Welcome! Lets get you started.
            </AppText>
            <AppText fontWeight="regular" size={14} color="navy800">
              We'd love to get to confirm your details.
            </AppText>
          </View>

          <View style={{ gap: 20 }}>
            <View style={{ gap: 8 }}>
              <AppText fontWeight="semiBold" size={14}>
                Full Name
              </AppText>
              <TextInput
                value={user.firstName! + " " + user.lastName!}
                editable={false}
                style={{
                  backgroundColor: COLORS.navy50,
                  paddingHorizontal: 8,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <AppText fontWeight="semiBold" size={14}>
                Email
              </AppText>
              <TextInput
                value={user.email!}
                editable={false}
                style={{
                  backgroundColor: COLORS.navy50,
                  paddingHorizontal: 8,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}
              />
            </View>

            {user.accessLevel === "Patient" && (
              <View style={{ gap: 8 }}>
                <AppText fontWeight="semiBold" size={14}>
                  Date of Birth
                </AppText>
                <TextInput
                  value={formatDOB(user.patient?.dob!)}
                  editable={false}
                  style={{
                    backgroundColor: COLORS.navy50,
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <MainButton text="Next" onPress={() => onSubmit()} />
      </View>
    </Animated.View>
  );
};

export default UserDetailsStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    height: 50,
  },
});
