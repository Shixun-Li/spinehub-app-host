import { useInfiniteQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import { ITEMS_PER_PAGE } from "@/constants/primitives";
import { getNextPageParam } from "@/utils/query";
import CategoryService from "@/services/category.service";
import SettingsService from "@/services/settings.service";
import TemplateService from "@/services/template.service";
import SurgeryService from "@/services/surgery.service";

export const useImplantCategoryQuery = (type: "Implant" | "Equipment") => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.IMPLANT_CATEGORY_CACHE_KEY],
    queryFn: ({ pageParam = 1 }) =>
      CategoryService.getCategory({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
        type: type,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useImplantQuery = (categoryId: string) => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.IMPLANT_CACHE_KEY, categoryId],
    queryFn: ({ pageParam = 1 }) =>
      SettingsService.getImplant({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
        categoryId,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useEquipmentQuery = (categoryId: string) => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.EQUIPMENT_CACHE_KEY, categoryId],
    queryFn: ({ pageParam = 1 }) =>
      SettingsService.getEquipment({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
        categoryId,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useFlagQuery = () => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.FLAG_CACHE_KEY],
    queryFn: ({ pageParam = 1 }) =>
      SettingsService.getFlag({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useRoleQuery = () => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.ROLE_CACHE_KEY],
    queryFn: ({ pageParam = 1 }) =>
      SettingsService.getRole({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useTemplateyQuery = () => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.IMPLANT_CATEGORY_CACHE_KEY],
    queryFn: ({ pageParam = 1 }) =>
      TemplateService.getTemplate({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
      }),
    initialPageParam: 1,
    getNextPageParam,
  });
};

export const useSurgeryListQuery = (selectedTemplateId: string) => {
  return useInfiniteQuery({
    queryKey: [CacheKeys.SURGERIES_CACHE_KEY, selectedTemplateId],
    queryFn: ({ pageParam = 1 }) =>
      SurgeryService.getSurgeryList({
        page: pageParam,
        perPage: ITEMS_PER_PAGE,
        templateId: selectedTemplateId,
      }),
    enabled: !!selectedTemplateId,
    initialPageParam: 1,
    getNextPageParam,
  });
};
