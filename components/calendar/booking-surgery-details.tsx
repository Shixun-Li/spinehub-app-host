import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { BookingData } from "@/types/backend-types";
import { SectionRow } from "./section-row";
import { formatDate, formatTime, getDuration } from "@/utils/formator";

const BookingSurgeryDetails = ({ booking }: { booking: BookingData }) => {
  return (
    <ScrollView style={styles.container}>
      <SectionRow
        label="Status"
        value={booking.status ?? "N/A"}
        booking={booking}
      />
      {booking.staffs?.length > 0 && (
        <View style={styles.section}>
          {[...booking.staffs]
            .sort((a, b) => {
              if (a.role.name === "Surgeon") return -1;
              if (b.role.name === "Surgeon") return 1;
              return 0;
            })
            .map((staff) => (
              <SectionRow
                key={staff.staffId}
                label={staff.role.name ?? "N/A"}
                value={`${staff.staff?.user.firstName ?? ""} ${
                  staff.staff?.user.lastName ?? ""
                }`}
              />
            ))}
        </View>
      )}
      <SectionRow label="Surgery Name" value={booking.surgeryName ?? "N/A"} />
      <SectionRow label="Date" value={formatDate(booking.startDate ?? "N/A")} />
      <SectionRow
        label="Start Time"
        value={formatTime(booking.startDate) ?? "N/A"}
      />
      <SectionRow
        label="Duration"
        value={getDuration(
          booking.startDate ?? undefined,
          booking.endDate ?? undefined
        )}
      />
      <SectionRow label="Table" value={booking.table ?? "N/A"} />
      <SectionRow label="Position" value={booking.position ?? "N/A"} />
      {booking?.implants && booking.implants.length > 0 && (
        <View style={styles.section}>
          {booking.implants.map((imp, idx) => (
            <SectionRow
              key={imp.id}
              label={idx === 0 ? "Implant" : ""}
              value={imp.name ?? ""}
              isList
            />
          ))}
        </View>
      )}
      {booking?.flags && booking.flags.length > 0 && (
        <View style={styles.section}>
          {booking.flags.map((flg, idx) => (
            <SectionRow
              key={flg.flag.item.id}
              label={idx === 0 ? "Flags" : ""}
              value={flg.flag.item.name ?? ""}
              isList
            />
          ))}
        </View>
      )}
      {booking?.equipments && booking.equipments.length > 0 && (
        <View style={styles.section}>
          {booking.equipments.map((eq, idx) => (
            <SectionRow
              key={eq.id}
              label={idx === 0 ? "Equipment" : ""}
              value={eq.name ?? ""}
              isList
            />
          ))}
        </View>
      )}
      <SectionRow
        label="Fasting Details"
        value={booking.fastingDetails ?? "N/A"}
      />
    </ScrollView>
  );
};

export default BookingSurgeryDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    flexDirection: "column",
    gap: 16,
  },
  section: {
    flexDirection: "column",
    gap: 8,
  },
});
