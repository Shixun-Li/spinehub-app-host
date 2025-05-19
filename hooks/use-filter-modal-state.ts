import { useState, useEffect } from "react";
import { Template } from "@/types/backend-types";

export const useFilterModalState = (
  visible: boolean,
  defaultFilter?: string,
  defaultValue?: string | null,
  defaultTemplate?: Template | null
) => {
  const [localFilter, setLocalFilter] = useState<string | undefined>(
    defaultFilter
  );
  const [localTemplate, setLocalTemplate] = useState<Template | undefined>(
    defaultTemplate ?? undefined
  );
  const [localSurgeonId, setLocalSurgeonId] = useState<string | null>(null);
  const [localSurgeryCode, setLocalSurgeryCode] = useState<string | undefined>(
    undefined
  );
  const [localStatus, setLocalStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      setLocalFilter(defaultFilter);
      setLocalTemplate(defaultTemplate ?? undefined);
      setLocalSurgeonId(
        defaultFilter === "Surgeon" ? defaultValue ?? null : null
      );
      setLocalSurgeryCode(
        defaultFilter === "Category" ? defaultValue ?? undefined : undefined
      );
      setLocalStatus(
        defaultFilter === "Status" ? defaultValue ?? undefined : undefined
      );
    }
  }, [visible, defaultFilter, defaultValue, defaultTemplate]);

  const filled = Boolean(
    (localFilter === "Surgeon" && localSurgeonId) ||
      (localFilter === "Category" && localSurgeryCode) ||
      (localFilter === "Status" && localStatus)
  );

  return {
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
  };
};
