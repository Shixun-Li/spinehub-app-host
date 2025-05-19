import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "@/components/core/app-text";
import BackButtonIcon from "@/assets/svgs/icons/back-button-icon";
import { COLORS } from "@/constants/theme";
import { Shadow } from "react-native-shadow-2";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import StaffService from "@/services/staff.service";

type StaffChatHeaderProps = {
  selectedUser: string | null;
  onBack: () => void;
};

const StaffChatHeader = ({ selectedUser, onBack }: StaffChatHeaderProps) => {
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: [CacheKeys.STAFFS_CACHE_KEY, selectedUser],
    queryFn: () =>
      StaffService.staffDetail({
        staffId: selectedUser ?? "",
      }),
    enabled: !!selectedUser,
  });
  const fullName = staffData?.data.firstName + " " + staffData?.data.lastName;

  return (
    <Shadow
      distance={10}
      offset={[0, 4]}
      startColor={COLORS.navy50}
      containerStyle={{ marginBottom: 16 }}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={onBack}>
            <BackButtonIcon />
          </TouchableOpacity>
          <View>
            {isLoadingStaff ? (
              <AppText size={14} fontWeight="semiBold">
                Loading...
              </AppText>
            ) : (
              <>
                <AppText size={14} fontWeight="semiBold">
                  {fullName}
                </AppText>
                <AppText size={12} fontWeight="medium" color="navy600">
                  {staffData?.data.staff?.role.name ?? "N/A"}
                </AppText>
              </>
            )}
          </View>
        </View>
        {/* Note: might need later */}
        {/* <View style={{ gap: 8, flexDirection: "row" }}>
          <View style={styles.iconContainer}>
            <AssignmentIcon />
          </View>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: COLORS.green1000 },
            ]}
          >
            <SendDocIcon />
          </View>
        </View> */}
      </View>
    </Shadow>
  );
};

export default StaffChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.lightBlue1000,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
