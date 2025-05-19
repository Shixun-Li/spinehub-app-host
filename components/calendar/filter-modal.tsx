import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "@/constants/theme";
import MainButton from "../core/main-button";
import { useSlideAnimation } from "@/hooks/use-slide-animation";
import StaffAutoComplete from "./staff-auto-complete";
import { Template } from "@/types/backend-types";
import { bookingStatus, filterBy } from "@/types/arrays";
import { useTemplateyQuery, useSurgeryListQuery } from "@/utils/queries";
import CustomDropdown from "../core/custom-drop-down";
import InfiniteCustomDropdown from "../core/infinite-\bcustom-drop-down";
import ModalHeader from "./modal-header";
import DropdownWrapper from "../core/drop-down-wrapper";
import { useFilterModalState } from "@/hooks/use-filter-modal-state";

type Props = {
  defaultFilter?: string;
  defaultValue?: string | null;
  defaultTemplate?: Template | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    filter: string;
    value: string | null | undefined;
    template?: Template | undefined;
  }) => void;
};

const FilterModal = ({
  defaultFilter,
  defaultValue,
  defaultTemplate,
  onSubmit,
  visible,
  onClose,
}: Props) => {
  const slideAnim = useSlideAnimation(visible);

  const {
    localFilter,
    setLocalFilter,
    localTemplate,
    setLocalTemplate,
    localSurgeonId,
    setLocalSurgeonId,
    localSurgeryCode,
    setLocalSurgeryCode,
    localStatus,
    setLocalStatus,
    filled,
  } = useFilterModalState(
    visible,
    defaultFilter,
    defaultValue,
    defaultTemplate
  );
  const [openDropdownName, setOpenDropdownName] = useState<string | null>(null);

  const templateQuery = useTemplateyQuery();
  const templates =
    templateQuery.data?.pages.flatMap((page) => page.data.data) ?? [];
  const surgeryQuery = useSurgeryListQuery(localTemplate?.id ?? "");
  const surgeries =
    surgeryQuery.data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleOpenDropdown = (name: string) => {
    setOpenDropdownName(name);
  };

  const handleConfirm = () => {
    if (!localFilter) return;
    const selectedValue = localSurgeonId || localSurgeryCode || localStatus;
    if (!selectedValue) return;

    onSubmit({
      filter: localFilter,
      value: selectedValue,
      ...(localFilter === "Category" && localTemplate
        ? { template: localTemplate }
        : {}),
    });
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.content}>
              <ModalHeader onClose={onClose} text=" Add Filter" />
              <DropdownWrapper isOpen={openDropdownName === "filter"}>
                <CustomDropdown
                  items={filterBy}
                  label="Select"
                  value={localFilter}
                  onChange={(val) => {
                    setLocalFilter(val);
                    setOpenDropdownName(null);
                  }}
                  placeholder="Select Filter"
                  isOpen={openDropdownName === "filter"}
                  onOpen={() => handleOpenDropdown("filter")}
                  onClose={() => setOpenDropdownName(null)}
                />
              </DropdownWrapper>
              {localFilter === "Category" && (
                <>
                  <DropdownWrapper isOpen={openDropdownName === "template"}>
                    <InfiniteCustomDropdown
                      label="Category"
                      placeholder="Select Category"
                      items={templates.map((t) => ({
                        label: t.title,
                        key: t.id,
                      }))}
                      value={localTemplate?.id}
                      onChange={(id) => {
                        setLocalSurgeryCode(undefined);
                        const foundTemplate = templates.find(
                          (t) => t.id === id
                        );
                        setLocalTemplate(foundTemplate ?? undefined);
                        setLocalSurgeonId(null);
                        setLocalStatus(undefined);
                        setOpenDropdownName(null);
                      }}
                      fetchNextPage={templateQuery.fetchNextPage}
                      hasNextPage={templateQuery.hasNextPage ?? false}
                      isFetchingNextPage={templateQuery.isFetchingNextPage}
                      isOpen={openDropdownName === "template"}
                      onOpen={() => handleOpenDropdown("template")}
                      onClose={() => setOpenDropdownName(null)}
                    />
                  </DropdownWrapper>
                  {localTemplate && (
                    <DropdownWrapper isOpen={openDropdownName === "surgery"}>
                      <InfiniteCustomDropdown
                        label="Surgery"
                        placeholder="Select Surgery"
                        items={surgeries.map((s) => ({
                          label: s.code,
                          key: s.code,
                        }))}
                        value={localSurgeryCode}
                        onChange={(code) => {
                          setLocalSurgeryCode(code);
                          setLocalSurgeonId(null);
                          setLocalStatus(undefined);
                          setOpenDropdownName(null);
                        }}
                        fetchNextPage={surgeryQuery.fetchNextPage}
                        hasNextPage={surgeryQuery.hasNextPage ?? false}
                        isFetchingNextPage={surgeryQuery.isFetchingNextPage}
                        isOpen={openDropdownName === "surgery"}
                        onOpen={() => handleOpenDropdown("surgery")}
                        onClose={() => setOpenDropdownName(null)}
                      />
                    </DropdownWrapper>
                  )}
                </>
              )}
              {localFilter === "Surgeon" && (
                <DropdownWrapper isOpen={openDropdownName === "surgeon"}>
                  <StaffAutoComplete
                    label="Surgeon"
                    value={localSurgeonId ?? ""}
                    onSelect={(id) => {
                      setLocalSurgeonId(id);
                      setLocalSurgeryCode(undefined);
                      setLocalStatus(undefined);
                      setLocalTemplate(undefined);
                      setOpenDropdownName(null);
                    }}
                    isSurgeon
                    isOpen={openDropdownName === "surgeon"}
                    onOpen={() => handleOpenDropdown("surgeon")}
                    onClose={() => setOpenDropdownName(null)}
                  />
                </DropdownWrapper>
              )}
              {localFilter === "Status" && (
                <DropdownWrapper isOpen={openDropdownName === "status"}>
                  <CustomDropdown
                    label="Status"
                    items={bookingStatus}
                    value={localStatus}
                    onChange={(val) => {
                      setLocalStatus(val);
                      setLocalSurgeonId(null);
                      setLocalSurgeryCode(undefined);
                      setLocalTemplate(undefined);
                      setOpenDropdownName(null);
                    }}
                    placeholder="Select Status"
                    isOpen={openDropdownName === "status"}
                    onOpen={() => handleOpenDropdown("status")}
                    onClose={() => setOpenDropdownName(null)}
                  />
                </DropdownWrapper>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <MainButton
                text="Confirm"
                onPress={handleConfirm}
                isDisabled={!filled}
                type="primary"
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: COLORS.smoke1000,
    paddingTop: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 540,
  },
  content: {
    paddingBottom: 24,
    flex: 1,
    gap: 2,
  },

  buttonContainer: {
    height: 60,
    justifyContent: "center",
    marginBottom: 25,
  },
});
