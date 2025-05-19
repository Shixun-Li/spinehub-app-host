import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import PatientService from "@/services/patient.service";
import FileCard from "./file-card";
import { BookingData } from "@/types/backend-types";
import AppText from "../core/app-text";

type Props = { booking: BookingData };

const FilesDetails = ({ booking }: Props) => {
  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: [CacheKeys.PATIENT_CACHE_KEY, booking.patient.userId],
    queryFn: () =>
      PatientService.patientDetail({
        patientId: booking.patient.userId ?? "",
      }),
    enabled: !!booking.patient.userId,
  });

  const documents = patientData?.data.patient?.documents ?? [];

  const showEmptyMessage = isLoadingPatient || documents.length === 0;

  return (
    <View style={styles.listContainer}>
      {showEmptyMessage ? (
        <View style={styles.textContainer}>
          <AppText size={14} color="navy600">
            {isLoadingPatient
              ? "Loading..."
              : "No files or links uploaded yet."}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <FileCard
                title={item.title}
                link={item.file}
                docType={item.type}
                createdAt={item.createdAt}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default FilesDetails;

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 8,
    flexDirection: "column",
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});
