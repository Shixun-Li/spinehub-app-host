import SearchIcon from "@/assets/svgs/icons/search-icon";
import { COLORS } from "@/constants/theme";
import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  containerStyle?: object;
  inputStyle?: TextInputProps["style"];
};

const SearchInput = ({
  onChange,
  placeholder = "Search",
  value,
  containerStyle,
  inputStyle,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <SearchIcon />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={COLORS.navy400}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    width: "100%",
    paddingHorizontal: 8,
    borderRadius: 24,
    backgroundColor: COLORS.navy50,
    gap: 10,
  },
  input: {
    flex: 1,
    fontWeight: "500",
    paddingVertical: 0,
  },
});

export default SearchInput;
