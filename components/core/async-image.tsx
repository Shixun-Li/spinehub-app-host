import FileService from "@/services/file.service";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type AsyncImageProps = {
  imageKey?: string | null;
  viewStyle: StyleProp<ViewStyle>;
  imageStyle: StyleProp<ImageStyle>;
  resizeHeight?: number;
  resizeWidth?: number;
  resizeMethod?: "center" | "cover" | "repeat" | "stretch" | "contain";
};

const AsyncImage = ({
  imageKey,
  viewStyle,
  imageStyle,
  resizeHeight,
  resizeWidth,
  resizeMethod,
}: AsyncImageProps) => {
  //Note: waiting for backend..
  // const [imageUri, setImageUri] = useState("");
  // const [isImageLoading, setIsImageLoading] = useState(false);
  // const [, setShouldDisplayImage] = useState(false);
  // const [hasError, setHasError] = useState(false);

  const [, setImageUri] = useState("");
  const [, setIsImageLoading] = useState(false);
  const [, setShouldDisplayImage] = useState(false);
  const [, setHasError] = useState(false);

  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
    imageKey ?? ""
  )}`;

  const getImageUrl = useCallback(
    async (image: string) => {
      try {
        setIsImageLoading(true);

        const imageDownloadResponse =
          resizeHeight && resizeWidth
            ? await FileService.downloadResize({
                fileName: image,
                height: resizeHeight,
                width: resizeWidth,
              })
            : await FileService.download({ fileName: image });

        if (!imageDownloadResponse) return;

        setImageUri(imageDownloadResponse.data.url);
      } catch (error) {
        console.log("Error", (error as Error).message); //Note: waiting for backend..
        setHasError(true);
      } finally {
        setIsImageLoading(false);
      }
    },
    [resizeHeight, resizeWidth]
  );

  useEffect(() => {
    if (imageKey === "" || !imageKey) return;
    getImageUrl(imageKey);
  }, [getImageUrl, imageKey]);

  function renderImage() {
    //Note: waiting for backend..
    // if (isImageLoading || !imageUri)
    //   return (
    //     <View
    //       style={[viewStyle, { justifyContent: "center", alignSelf: "center" }]}
    //     >
    //       <ActivityIndicator size="small" color={COLORS.smoke1000} />
    //     </View>
    //   );

    // if (hasError)
    //   return (
    //     <View
    //       style={[
    //         viewStyle,
    //         {
    //           backgroundColor: COLORS.smoke1000,
    //           justifyContent: "center",
    //           alignItems: "center",
    //         },
    //       ]}
    //     >
    //       <AppText align="center" color="grey" fontWeight="light">
    //         Error loading image
    //       </AppText>
    //     </View>
    //   );

    return (
      <Image
        style={[styles.image, imageStyle]}
        resizeMode={resizeMethod}
        source={{ uri: avatarUrl }}
        // source={{ uri: imageUri }}
        onLoadEnd={() => setShouldDisplayImage(true)}
      />
    );
  }

  return <View>{renderImage()}</View>;
};

export default AsyncImage;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
