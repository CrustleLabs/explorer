import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {ResponseError} from "../../api/client";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getBlockByHeight, getBlockByVersion} from "../v2";
import {Block} from "@aptos-labs/ts-sdk";

export function useGetBlockByHeight({
  height,
  withTransactions = true,
}: {
  height: number;
  withTransactions?: boolean;
}) {
  const [state] = useGlobalState();

  return useQuery<Block, ResponseError>({
    queryKey: ["block", height, state.network_value],
    queryFn: () =>
      getBlockByHeight({height, withTransactions}, state.sdk_v2_client),
    refetchInterval: 1200000,
    enabled: !isNaN(height) && height >= 0, // Only fetch if height is a valid number
  });
}

export function useGetBlockByVersion({
  version,
  withTransactions = true,
  options,
}: {
  version: number;
  withTransactions?: boolean;
  options?: Omit<UseQueryOptions<Block, ResponseError>, "queryKey" | "queryFn">;
}) {
  const [state] = useGlobalState();

  return useQuery<Block, ResponseError>({
    queryKey: ["block", version, state.network_value],
    queryFn: () =>
      getBlockByVersion({version, withTransactions}, state.sdk_v2_client),
    ...options,
  });
}
