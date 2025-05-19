import React from "react";
import { TextInput, StyleSheet } from "react-native";
import AppText from "../core/app-text";
import { COLORS } from "@/constants/theme";

interface Props {
  title: string;
  onTitleChange: (t: string) => void;
  linkText: string;
  onLinkChange: (l: string) => void;
  showLinkInput: boolean;
  linkError: string | null;
}

const DocFormInputs = ({
  title,
  onTitleChange,
  linkText,
  onLinkChange,
  showLinkInput,
  linkError,
}: Props) => (
  <>
    {showLinkInput && (
      <>
        <AppText size={14} fontWeight="semiBold" style={styles.label}>
          Link
        </AppText>
        <TextInput
          style={styles.input}
          placeholder="Enter link"
          placeholderTextColor={COLORS.navy600}
          value={linkText}
          onChangeText={onLinkChange}
        />
        {linkError && (
          <AppText size={12} color="red" style={{ marginTop: 4 }}>
            {linkError}
          </AppText>
        )}
      </>
    )}
    <AppText size={14} fontWeight="semiBold" style={styles.label}>
      Title
    </AppText>
    <TextInput
      style={styles.input}
      placeholder="Enter title"
      placeholderTextColor={COLORS.navy600}
      value={title}
      onChangeText={onTitleChange}
    />
  </>
);

export default DocFormInputs;

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.navy1000,
    backgroundColor: COLORS.navy50,
    height: 50,
  },
  label: {
    marginTop: 8,
    marginBottom: 6,
  },
});
