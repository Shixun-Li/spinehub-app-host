import { FlatList, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import PatientService from "@/services/patient.service";
import FileCard from "@/components/calendar/file-card";
import AppText from "@/components/core/app-text";

const DocumentPage = () => {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: [CacheKeys.PATIENT_CACHE_KEY, patientId],
    queryFn: () =>
      PatientService.patientDetail({
        patientId: patientId ?? "",
      }),
    enabled: !!patientId,
  });

  const documents = patientData?.data.patient?.documents ?? [];

  const showEmptyMessage = isLoadingPatient || documents.length === 0;

  return (
    <View style={styles.body}>
      <HomeHeader title="Documents" withBackButton />
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
    </View>
  );
};

export default DocumentPage;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
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
