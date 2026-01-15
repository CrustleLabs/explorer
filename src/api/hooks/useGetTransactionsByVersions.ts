import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getTransaction} from "../../api";

export function useGetTransactionsByVersions(versions: number[]) {
  const [state] = useGlobalState();

  return useQuery({
    queryKey: ["transactionsByVersions", versions, state.network_value],
    queryFn: async () => {
      if (!versions.length) return [];

      const promises = versions.map((version) =>
        getTransaction({txnHashOrVersion: version}, state.aptos_client),
      );

      return Promise.all(promises);
    },
    enabled: versions.length > 0,
    placeholderData: keepPreviousData,
  });
}
