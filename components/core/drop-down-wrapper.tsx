import React from "react";
import { View } from "react-native";

const DropdownWrapper = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return <View style={{ zIndex: isOpen ? 20 : 1 }}>{children}</View>;
};

export default DropdownWrapper;
