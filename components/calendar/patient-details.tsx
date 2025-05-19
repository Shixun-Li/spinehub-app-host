import { BookingData } from "@/types/backend-types";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import UserCard from "./user-card";
import UserDetailList from "./user-detail-list";

const PatientDetail = ({ booking }: { booking: BookingData }) => {
  if (!booking) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserCard patient={booking.patient} />
      <UserDetailList patient={booking.patient} />
    </View>
  );
};

export default PatientDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    marginTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
