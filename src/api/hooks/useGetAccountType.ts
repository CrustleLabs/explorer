import {Types} from "aptos";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getAccountResource} from "..";
import {ResponseError} from "../client";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {objectCoreResource} from "../../constants";

export type AccountTypeData = {
  isAccount: boolean;
  isObject: boolean;
  isMultisig: boolean;
  accountData?: Types.AccountData;
};

export function useGetAccountType(
  address: string,
): UseQueryResult<AccountTypeData, ResponseError> {
  const [state] = useGlobalState();

  return useQuery<AccountTypeData, ResponseError>({
    queryKey: ["accountType", {address}, state.network_value],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");

      const client = state.aptos_client;

      // Parallel fetch of the 3 key resources
      // We handle 404s for each resource individually so one missing doesn't fail the whole query
      const [accountRes, objectRes, multisigRes] = await Promise.all([
        // 1. Account Resource
        getAccountResource(
          {address, resourceType: "0x1::account::Account"},
          client,
        ).catch(() => null),

        // 2. Object Resource
        getAccountResource(
          {address, resourceType: objectCoreResource},
          client,
        ).catch(() => null),

        // 3. Multisig Resource
        getAccountResource(
          {address, resourceType: "0x1::multisig_account::MultisigAccount"},
          client,
        ).catch(() => null),
      ]);

      // If absolutely nothing exists, it might be a true 404/invalid address,
      // but for "Account Type" purposes we just report what we found.
      // If we need to strictly throw 404 when *nothing* is found, we can do it here.
      // However, typical behavior is just to return "not an account" flags.

      return {
        isAccount: !!accountRes,
        isObject: !!objectRes,
        isMultisig: !!multisigRes,
        accountData: accountRes
          ? (accountRes.data as Types.AccountData)
          : undefined,
      };
    },
    retry: false,
  });
}
