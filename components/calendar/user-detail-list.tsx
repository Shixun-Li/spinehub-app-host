import { formatDOB, formatPhoneNumber } from "@/utils/formator";
import React from "react";
import { View } from "react-native";
import { Patient } from "@/types/backend-types";
import Divider from "../core/\bdivider";
import { SectionRow } from "./section-row";

interface Props {
  patient?: Patient;
}

const UserDetailList = ({ patient }: Props) => {
  return (
    <View>
      <SectionRow label="D.O.B" value={formatDOB(patient?.dob) || "N/A"} />
      <SectionRow label="Age" value={patient?.age?.toString() ?? "N/A"} />
      {/* <SectionRow label="Address" value={formatFullAddress(patient?.)} /> */}
      <SectionRow label="Gender" value={patient?.gender ?? "N/A"} />
      <SectionRow
        label="Mobile"
        value={formatPhoneNumber(patient?.user.phoneNumber ?? "N/A")}
      />
      <SectionRow label="Email" value={patient?.user.email ?? "N/A"} />
      <View style={{ marginBottom: 8 }}>
        <Divider text="Emergency" />
      </View>
      <SectionRow
        label="Name"
        value={patient?.emergencyName?.trim() || "N/A"}
      />
      <SectionRow
        label="Relationship"
        value={patient?.relationship?.trim() || "N/A"}
      />
      <SectionRow
        label="Mobile"
        value={formatPhoneNumber(patient?.emergencyPhone ?? "N/A")}
      />
    </View>
  );
};

export default UserDetailList;
