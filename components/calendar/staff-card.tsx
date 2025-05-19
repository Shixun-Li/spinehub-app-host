import React from "react";
import AppText from "../core/app-text";
import { Event } from "@/types/backend-types";
import { StyleSheet, View } from "react-native";
import CbIcon from "@/assets/svgs/icons/cb-icon";
import AkIcon from "@/assets/svgs/icons/ak-icon";
import PersonIcon from "@/assets/svgs/icons/person-icon";
import { COLORS } from "@/constants/theme";
import { ROLE_TYPES } from "@/constants/primitives";

type Props = {
  event: Event;
};

const StaffCard = ({ event }: Props) => {
  const staff = event.event?.staff;
  const firstName = staff?.user?.firstName ?? "";
  const lastName = staff?.user?.lastName ?? "";
  const roleName = staff?.role?.name ?? "";
  const lastNameInitial = lastName.charAt(0).toUpperCase();
  if (roleName === ROLE_TYPES.SURGEON) {
    return null;
  }

  let IconComponent = PersonIcon;
  let backgroundColor = COLORS.navy50;

  if (roleName === ROLE_TYPES.ANAESTHETIST) {
    IconComponent = CbIcon;
    backgroundColor = COLORS.charcoal100;
  } else if (roleName === "Assistant") {
    IconComponent = AkIcon;
    backgroundColor = COLORS.charcoal100;
  }

  return (
    <View style={[styles.itemContainer, { backgroundColor }]}>
      <IconComponent />
      <AppText size={10} color="navy800" fontWeight="semiBold" key={event.id}>
        {firstName} {lastNameInitial}.
      </AppText>
    </View>
  );
};

export default StaffCard;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 24,
  },
});
