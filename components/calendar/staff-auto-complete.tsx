import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AWAIT_IN_MILLISECONDS, ITEMS_PER_PAGE } from "@/constants/primitives";
import CacheKeys from "@/services/cache-keys";
import StaffService from "@/services/staff.service";
import { getNextPageParam } from "@/utils/query";
import InfiniteCustomDropdown from "../core/infinite-\bcustom-drop-down";

interface StaffAutoCompleteProps {
  roleId?: string;
  value: string | null;
  onSelect: (value: string | null) => void;
  isSurgeon?: boolean;
  initialSearch?: string;
  isDisabled?: boolean;
  label?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const StaffAutoComplete = ({
  roleId,
  value,
  onSelect,
  label,
  isSurgeon = false,
  initialSearch,
  isDisabled = false,
  isOpen = false,
  onOpen,
  onClose,
}: StaffAutoCompleteProps) => {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebouncedValue(search, AWAIT_IN_MILLISECONDS);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        CacheKeys.STAFFS_CACHE_KEY,
        roleId,
        debouncedSearch,
        isSurgeon,
      ],
      queryFn: ({ pageParam = 1 }) =>
        StaffService.getStaff({
          page: pageParam,
          perPage: ITEMS_PER_PAGE,
          name: debouncedSearch,
          ...(isSurgeon ? { isSurgeon } : { roleId }),
        }),
      initialPageParam: 1,
      getNextPageParam,
    });

  const items =
    data?.pages.flatMap((page) =>
      page.data.data.map((staff) => ({
        label: `${staff.firstName} ${staff.lastName}`,
        value: staff.id,
        key: staff.id,
      }))
    ) || [];

  const handleChange = (val: string) => {
    onSelect(val);
    const selected = items.find((item) => item.value === val);
    if (selected) {
      setSearch(selected.label);
    }
  };

  return (
    <InfiniteCustomDropdown
      label={label}
      disabled={isDisabled}
      items={items}
      value={value ?? ""}
      onChange={handleChange}
      placeholder={isSurgeon ? "Select surgeon..." : "Select staff..."}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};

export default StaffAutoComplete;
