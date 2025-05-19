import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import PatientService from "@/services/patient.service";
import PatientDetailTab from "@/components/chat/patient-tab";
import { useState } from "react";
import { PatientDetailsTabEnum } from "@/types/\benum";
import UserCard from "@/components/calendar/user-card";
import UserDetailList from "@/components/calendar/user-detail-list";
import BillingDetail from "@/components/calendar/billing-detail";
import { mapToPatient } from "@/utils/formator";

const PatientInformation = () => {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [selectedTab, setSelectedTab] = useState<PatientDetailsTabEnum>(
    PatientDetailsTabEnum.PATIENT
  );

  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: [CacheKeys.PATIENT_CACHE_KEY, patientId],
    queryFn: () =>
      PatientService.patientDetail({
        patientId: patientId ?? "",
      }),
    enabled: !!patientId,
  });

  return (
    <View style={styles.body}>
      <HomeHeader title="Patient Information" withBackButton />
      <View style={styles.container}>
        {isLoadingPatient && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {!isLoadingPatient && (
          <>
            <PatientDetailTab
              PatientDetailTab={selectedTab}
              setPatientDetailTab={setSelectedTab}
            />
            {selectedTab === PatientDetailsTabEnum.PATIENT && (
              <View style={styles.container}>
                {patientData?.data && (
                  <UserCard patient={mapToPatient(patientData.data)} />
                )}
                {patientData?.data && (
                  <UserDetailList patient={mapToPatient(patientData.data)} />
                )}
              </View>
            )}
            {selectedTab === PatientDetailsTabEnum.BILLING &&
              patientData?.data && (
                <View style={{ marginTop: -16 }}>
                  <BillingDetail patient={patientData.data} />
                </View>
              )}
          </>
        )}
      </View>
    </View>
  );
};

export default PatientInformation;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
