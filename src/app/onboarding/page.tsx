import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const iosAppStoreURL = "https://apps.apple.com/app/idYOUR_APP_ID";
    const androidPlayStoreURL =
      "https://play.google.com/store/apps/details?id=com.spinehub.app";

    // Use window.navigator instead of navigator directly
    const userAgent = window.navigator.userAgent || window.navigator.vendor;

    if (/android/i.test(userAgent)) {
      window.location.replace(androidPlayStoreURL);
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.location.replace(iosAppStoreURL);
    } else {
      // Desktop fallback
      console.log("Desktop detected or unknown device.");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Redirecting to the app store...</h2>
      <p>
        If you are not redirected, please{" "}
        <a href="https://apps.apple.com/app/idYOUR_APP_ID">click here</a>.
      </p>
    </div>
  );
};

export default Page;
