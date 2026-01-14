import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {Types} from "aptos";
import {useGlobalState} from "../../global-config/GlobalConfig";

export function useGetAccountTransactions(
  address: string | undefined,
  start?: number,
  limit: number = 10,
  options?: {refetchInterval?: number},
): UseQueryResult<Types.Transaction[], Error> {
  const [state] = useGlobalState();

  return useQuery({
    queryKey: [
      "accountTransactions",
      address,
      {start, limit},
      state.network_value,
    ],
    queryFn: async (): Promise<Types.Transaction[]> => {
      if (!address) return [];
      const queryOptions: {limit?: number; start?: bigint} = {limit};
      if (start !== undefined) queryOptions.start = BigInt(start);
      return (await state.aptos_client.getAccountTransactions(
        address,
        queryOptions,
      )) as Types.Transaction[];
    },
    enabled: !!address,
    refetchInterval: options?.refetchInterval ?? 5000, // Poll every 5 seconds by default
  });
}
