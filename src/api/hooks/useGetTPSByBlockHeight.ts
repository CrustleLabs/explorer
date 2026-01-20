import {useEffect, useState} from "react";
import {Block} from "@aptos-labs/ts-sdk";
import {useGetBlockByHeight} from "./useGetBlock";
import {parseTimestamp} from "../../pages/utils";

const TPS_FREQUENCY = 600; // calculate tps every 600 blocks
const BLOCK_OFFSET = 5; // Use a block slightly in the past to ensure it's indexed

// Extended block type to handle various API response formats
type BlockData = Block & {
  last_version?: string | number;
  last_transaction_version?: string | number;
  block_timestamp?: string | number;
  timestamp?: string | number;
  header?: {
    last_version?: string | number;
    timestamp?: string | number;
  };
};

function calculateTps(
  startBlock: BlockData,
  endBlock: BlockData,
): number | null {
  if (!startBlock || !endBlock) return null;

  // Extract versions safely
  const getVersion = (block: BlockData): number => {
    const v =
      block.last_version ??
      block.last_transaction_version ??
      block.header?.last_version;
    if (v === undefined || v === null) return NaN;
    try {
      return Number(v);
    } catch {
      return NaN;
    }
  };

  // Extract timestamps safely
  const getTimestamp = (block: BlockData): string | undefined => {
    const t =
      block.block_timestamp ?? block.timestamp ?? block.header?.timestamp;
    return t !== undefined && t !== null ? t.toString() : undefined;
  };

  const startVersion = getVersion(startBlock);
  const endVersion = getVersion(endBlock);
  const startTimeStr = getTimestamp(startBlock);
  const endTimeStr = getTimestamp(endBlock);

  if (
    isNaN(startVersion) ||
    isNaN(endVersion) ||
    !startTimeStr ||
    !endTimeStr
  ) {
    return null;
  }

  const startMoment = parseTimestamp(startTimeStr);
  const endMoment = parseTimestamp(endTimeStr);

  const startUnix = startMoment.unix();
  const endUnix = endMoment.unix();
  const durationInSec = endUnix - startUnix;

  if (durationInSec <= 0) {
    return null;
  }

  const tps = (endVersion - startVersion) / durationInSec;
  return isNaN(tps) || tps <= 0 ? null : Math.abs(tps);
}

export function useGetTPSByBlockHeight(currentBlockHeight: number | undefined) {
  // Use BLOCK_OFFSET to ensure we are requesting a block that is already indexed/available
  const blockHeight =
    currentBlockHeight !== undefined
      ? currentBlockHeight - BLOCK_OFFSET
      : undefined;

  const [tps, setTps] = useState<number | null>(null);

  const startBlockHeight =
    blockHeight !== undefined ? Math.max(0, blockHeight - TPS_FREQUENCY) : 0;

  const {data: startBlock, isLoading: isStartLoading} = useGetBlockByHeight({
    height: startBlockHeight,
    withTransactions: false,
  });
  const {data: endBlock, isLoading: isEndLoading} = useGetBlockByHeight({
    height: blockHeight ?? 0,
    withTransactions: false,
  });

  const isLoading =
    isStartLoading || isEndLoading || currentBlockHeight === undefined;

  useEffect(() => {
    if (startBlock && endBlock) {
      const result = calculateTps(startBlock, endBlock);
      // Only update if we got a valid TPS value
      if (result !== null && result > 0) {
        setTps(result);
      }
    }
  }, [startBlock, endBlock, blockHeight]);

  return {tps, isLoading};
}
