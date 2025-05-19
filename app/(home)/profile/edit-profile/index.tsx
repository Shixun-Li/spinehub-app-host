import { StyleSheet, View } from "react-native";
import { COLORS, GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import AsyncImage from "@/components/core/async-image";
import PencilIcon from "@/assets/svgs/icons/pencil-icon";
import TextInputValidated from "@/components/core/text-input-validated";
import { useForm } from "react-hook-form";
import { EditProfileData } from "@/types/auth";
import { editProfileSchema } from "@/utils/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import MainButton from "@/components/core/main-button";
import useUserStore from "@/stores/user-store";
import { useEffect } from "react";

const EditProfile = () => {
  const { user } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileData>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: EditProfileData) => {
    console.log("Saving Profile:", data); //Note: waiting for backend..
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <HomeHeader title="Edit Profile" withBackButton route="/profile" />
        <View style={styles.image}>
          <AsyncImage
            imageKey={"dqe"}
            resizeHeight={100}
            resizeWidth={100}
            viewStyle={{ height: 130, width: 130, borderRadius: 70 }}
            imageStyle={{ height: 130, width: 130, borderRadius: 70 }}
          />
          <View style={styles.editCard}>
            <PencilIcon />
          </View>
        </View>
        <TextInputValidated
          name="email"
          label="Email"
          inputPlaceholder="Enter Email"
          control={control}
          error={errors.email?.message}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: COLORS.lightBlue1000,
          }}
          returnKeyType="next"
        />
        <TextInputValidated
          name="phoneNumber"
          label="Phone Number"
          inputPlaceholder="Enter Phone Number"
          control={control}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: COLORS.lightBlue1000,
          }}
          error={errors.phoneNumber?.message}
          returnKeyType="next"
        />
      </View>
      <View style={styles.buttonSize}>
        <MainButton
          text="Confirm"
          type="primary"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
    flex: 1,
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  container: {
    gap: 10,
  },
  editCard: {
    position: "absolute",
    bottom: 0,
    padding: 6,
    backgroundColor: COLORS.navy1000,
    borderRadius: 24,
    alignItems: "center",
    width: 36,
    height: 36,
    justifyContent: "center",
    transform: [{ translateX: 50 }],
  },
  buttonSize: {
    height: 50,
  },
});
