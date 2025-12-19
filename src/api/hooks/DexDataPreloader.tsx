import React from "react";
import {useGetPerpetuals} from "./useGetPerpetuals";
import {useGetLeverageTiers} from "./useGetLeverageTiers";

/**
 * Global preloader for DEX-related data.
 * This component intentionally renders nothing. Its purpose is to trigger the
 * useGetPerpetuals and useGetLeverageTiers hooks at the root of the application,
 * ensuring the data is fetched and cached by React Query as soon as the app loads.
 */
export const DexDataPreloader: React.FC = () => {
  // These hooks will fetch data and cache it globally
  useGetPerpetuals();
  useGetLeverageTiers();

  return null;
};
