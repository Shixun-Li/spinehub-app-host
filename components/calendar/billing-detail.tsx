import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { BookingData, PatientData } from "@/types/backend-types";
import { formatDOB } from "@/utils/formator";
import Divider from "../core/\bdivider";
import { SectionRow } from "./section-row";
import { useQuery } from "@tanstack/react-query";
import PatientService from "@/services/patient.service";
import CacheKeys from "@/services/cache-keys";

type Props =
  | { booking: BookingData; patient?: never }
  | { patient: PatientData; booking?: never };

const PatientBillingDetails = ({ booking, patient }: Props) => {
  const { data: fetchedPatientData } = useQuery({
    queryKey: [CacheKeys.PATIENT_CACHE_KEY, booking?.patient.userId],
    queryFn: () =>
      PatientService.patientDetail({
        patientId: booking!.patient.userId,
      }),
    enabled: !!booking?.patient.userId,
  });

  const patientData: PatientData | undefined =
    patient ?? fetchedPatientData?.data;
  const patientBilling = patientData?.patient?.billing;
  const thirdParty = patientData?.patient?.thirdParty;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Divider text="Billing" />
        <SectionRow
          label="Referring GP"
          value={patientBilling?.referringGP ?? "N/A"}
        />
        <SectionRow
          label="Provider Number"
          value={patientBilling?.providerNumber ?? "N/A"}
        />
        <Divider text="Medicare" />
        <SectionRow
          label="Policy Number"
          value={patientBilling?.medicare?.policyNumber ?? "N/A"}
        />
        <SectionRow
          label="Expiry"
          value={formatDOB(patientBilling?.medicare?.expiryDate) ?? "N/A"}
        />
        <SectionRow
          label="Reference"
          value={patientBilling?.medicare?.reference ?? "N/A"}
        />
        <Divider text="Private Insurance" />
        <SectionRow
          label="Payer Name"
          value={patientBilling?.privateInsurance?.payerName || "N/A"}
        />
        <SectionRow
          label="Policy Number"
          value={patientBilling?.privateInsurance?.policyNumber || "N/A"}
        />
        <Divider text="3rd Party" />
        <SectionRow label="Payer Name" value={thirdParty?.payerName || "N/A"} />
        <SectionRow label="Contact" value={thirdParty?.contact || "N/A"} />
        <SectionRow label="Email" value={thirdParty?.email || "N/A"} />
        <SectionRow
          label="Claim Number"
          value={thirdParty?.claimNumber || "N/A"}
        />
      </View>
    </ScrollView>
  );
};

export default PatientBillingDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  section: {
    flexDirection: "column",
    gap: 4,
  },
});
