import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { COLORS, GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import AppText from "@/components/core/app-text";
import AsyncImage from "@/components/core/async-image";
import EditProfileIcon from "@/assets/svgs/icons/edit-profile-icon";
import ChangePasswordIcon from "@/assets/svgs/icons/change-password-icon";
import TermsIcon from "@/assets/svgs/icons/terms-icon";
import PrivacyIcon from "@/assets/svgs/icons/privacy-icon";
import SignOutIcon from "@/assets/svgs/icons/sign-out-icon";
import SettingCard from "@/components/profile/setting-card";
import useUserStore from "@/stores/user-store";
import SignOutModal from "@/components/profile/\bsign-out-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_TOKEN } from "@/constants/primitives";
import { router } from "expo-router";
import { SIGN_OUT_SUCCESS } from "@/constants/snackbar";
import { useSnackbarActions } from "@/stores/snackbar-store";
import DeleteAccountModal from "@/components/profile/delete-account-modal";

const Profile = () => {
  const { user } = useUserStore();
  const [isSignOutVisible, setSignOutVisible] = useState(false);
  const [isDeleteAccpountVisible, setDeleteAccountVisible] = useState(false);
  const { addSnack } = useSnackbarActions();

  const handleSignOut = async () => {
    await AsyncStorage.removeItem(APP_TOKEN);

    if (router.canDismiss()) router.dismissAll();
    router.navigate("/(auth)");

    setSignOutVisible(false);
    addSnack({
      severity: "success",
      message: SIGN_OUT_SUCCESS,
    });
  };

  const handleDeleteAccount = async () => {
    console.log("Delete Account Flow Will Come here"); //Note: waiting for backend..
  };

  return (
    <View style={styles.body}>
      <HomeHeader title="Profile" />
      <View style={styles.profileCard}>
        <AsyncImage
          imageKey={"dqe"}
          resizeHeight={100}
          resizeWidth={100}
          viewStyle={{ height: 56, width: 56, borderRadius: 70 }}
          imageStyle={{ height: 56, width: 56, borderRadius: 70 }}
        />
        <View>
          <AppText
            color="smoke1000"
            fontWeight="semiBold"
            size={20}
            align="left"
          >
            {user?.firstName} {user?.lastName}
          </AppText>
          <AppText color="smoke1000" fontWeight="medium" size={12} align="left">
            {user?.accessLevel}
          </AppText>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <SettingCard
          icon={<EditProfileIcon />}
          label="Edit Profile"
          onPress={() => router.push("/(home)/profile/edit-profile")}
        />
        <SettingCard
          icon={<ChangePasswordIcon />}
          label="Change Password"
          onPress={() => router.push("/(home)/profile/change-password")}
        />
      </View>

      <View
        style={{
          marginVertical: 16,
          borderColor: COLORS.navy200,
          borderWidth: 0.5,
        }}
      />

      <View style={{ gap: 8 }}>
        <SettingCard
          icon={<TermsIcon />}
          label="Terms of use"
          onPress={() => {}}
        />
        <SettingCard
          icon={<PrivacyIcon />}
          label="Privacy Policy"
          onPress={() => {}}
        />
        <SettingCard
          icon={<SignOutIcon />}
          label="Sign Out"
          onPress={() => setSignOutVisible(true)}
        />

        <SignOutModal
          visible={isSignOutVisible}
          onClose={() => setSignOutVisible(false)}
          onConfirm={handleSignOut}
        />
        {/* <SettingCard
          icon={<DeleteAccountIcon />}
          label="Delete Account"
          onPress={() => setDeleteAccountVisible(true)}
        /> */}
        <DeleteAccountModal
          visible={isDeleteAccpountVisible}
          onClose={() => setDeleteAccountVisible(false)}
          onConfirm={handleDeleteAccount}
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
  },
  profileCard: {
    padding: 16,
    backgroundColor: COLORS.lightBlue1000,
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 20,
  },
});
