import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import HomeHeader from "@/components/core/home-header";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import BookingService from "@/services/booking.service";
import { useState } from "react";
import BookingDetailTab from "@/components/calendar/booking-tabs";
import BookingSurgeryDetails from "@/components/calendar/booking-surgery-details";
import PatientDetail from "@/components/calendar/patient-details";
import BillingDetail from "@/components/calendar/billing-detail";
import FilesDetails from "@/components/calendar/files-details";
import { BookingDetailsTabEnum } from "@/types/\benum";

const SurgeryOverview = () => {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const [selectedTab, setSelectedTab] = useState<BookingDetailsTabEnum>(
    BookingDetailsTabEnum.DETAILS
  );
  const { data: bookingData, isLoading: isLoadingBookingData } = useQuery({
    queryKey: [CacheKeys.BOOKING_DETAIL_CACHE_KEY, bookingId],
    queryFn: () =>
      BookingService.bookingDetail({
        bookingId: bookingId ?? "",
      }),
    enabled: !!bookingId,
  });

  const currentBooking = bookingData?.data;

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <HomeHeader title="Surgery Overview" withBackButton />
        {isLoadingBookingData && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {!isLoadingBookingData && currentBooking && (
          <>
            <BookingDetailTab
              bookingDetailTab={selectedTab}
              setBookingDetailTab={setSelectedTab}
            />

            {selectedTab === BookingDetailsTabEnum.DETAILS && (
              <BookingSurgeryDetails booking={currentBooking} />
            )}
            {selectedTab === BookingDetailsTabEnum.PATIENT && (
              <PatientDetail booking={currentBooking} />
            )}
            {selectedTab === BookingDetailsTabEnum.BILLING && (
              <BillingDetail booking={currentBooking} />
            )}
            {selectedTab === BookingDetailsTabEnum.DOCS && (
              <FilesDetails booking={currentBooking} />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SurgeryOverview;

const styles = StyleSheet.create({
  body: {
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
