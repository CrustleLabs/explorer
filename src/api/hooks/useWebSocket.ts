import {useEffect, useRef, useState, useCallback} from "react";
import {Types} from "aptos";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {getTransactions} from "../index";

// Constants from user request or environment
const WS_URL = import.meta.env.VITE_WS_URL || "ws://57.128.230.68:23332/ws";
const CHANNEL = "all";
const CODE = "Crustle2025!";
const MAX_LOG_ITEMS = 100; // Max items to keep in state

// Types for WebSocket messages
type BlockMessage = {
  type: "block";
  data: {
    count: number;
    firstHeight: number;
    lastHeight: number;
    blocks: Types.Block[];
  };
};

type TransactionMessage = {
  type: "transaction";
  data: {
    count: number;
    firstVersion: number;
    lastVersion: number;
    transactions: Types.Transaction[];
  };
};

type WsMessage =
  | BlockMessage
  | TransactionMessage
  | {type: "subscribed"; channel: string}
  | {type: "unsubscribed"; channel: string}
  | {type: "pong"}
  | {type: "error"; error: string};

export function useWebSocket() {
  const [state] = useGlobalState();
  const [blocks, setBlocks] = useState<Types.Block[]>([]);
  const [transactions, setTransactions] = useState<Types.Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const seenTxVersions = useRef<Set<string>>(new Set());
  const seenBlockHeights = useRef<Set<string>>(new Set());

  // Initial Fetch via REST API
  const fetchInitialData = useCallback(async (): Promise<number | null> => {
    try {
      // Fetch latest blocks
      const ledgerInfo = await state.aptos_client.getLedgerInfo();
      const latestHeight = parseInt(ledgerInfo.block_height);
      const PREVIEW_LIMIT = 10;
      const blockPromises = [];
      for (let i = 0; i < PREVIEW_LIMIT; i++) {
        const height = latestHeight - i;
        if (height >= 0) {
          blockPromises.push(
            state.aptos_client.getBlockByHeight(height, false),
          );
        }
      }
      const initialBlocks = await Promise.all(blockPromises);

      // Update blocks state
      setBlocks(() => {
        const newBlocks = [...initialBlocks];
        newBlocks.forEach((b) => seenBlockHeights.current.add(b.block_height));
        return newBlocks;
      });

      // Set initial latest block height ref
      if (initialBlocks.length > 0) {
        // initialBlocks are fetched descending (latestHeight - i)
        seenBlockHeights.current.add(initialBlocks[0].block_height);
      }

      // Fetch latest transactions
      const initialTxs = await getTransactions(
        {limit: PREVIEW_LIMIT},
        state.aptos_client,
      );

      // Update transactions state
      if (initialTxs) {
        setTransactions(() => {
          const newTxs = [...initialTxs];
          newTxs.forEach((tx) => {
            const v =
              "version" in tx ? tx.version : `${tx.type}-${Math.random()}`;
            seenTxVersions.current.add(v);
          });
          return newTxs;
        });
      }

      return initialBlocks.length > 0
        ? parseInt(initialBlocks[0].block_height)
        : latestHeight;
    } catch (e) {
      console.error("Failed to fetch initial data", e);
      return null;
    }
  }, [state.aptos_client]);

  useEffect(() => {
    let ws: WebSocket;
    let heartbeatInterval: NodeJS.Timeout;

    const init = async () => {
      const initialHeight = await fetchInitialData();
      // Fallback if fetch failed, although initialHeight might be null, we still connect.
      const latestHeightRef: {current: number | null} = {
        current: initialHeight,
      };

      // Establish WebSocket connection
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WebSocket] Connected");
        setIsConnected(true);

        // Subscribe
        const subscribeMsg = {
          type: "subscribe",
          id: "explorer-sub",
          code: CODE,
          params: {
            channel: CHANNEL,
          },
        };
        ws.send(JSON.stringify(subscribeMsg));

        // Start Heartbeat
        heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({type: "ping", id: "heartbeat"}));
          }
        }, 25000); // 25s
      };

      ws.onmessage = async (event) => {
        try {
          const msg: WsMessage = JSON.parse(event.data.toString());

          switch (msg.type) {
            case "block":
              if (msg.data.blocks && msg.data.blocks.length > 0) {
                const newBlocks = msg.data.blocks.reverse(); // Newest first
                let backfilledBlocks: Types.Block[] = [];

                const newestHeight = parseInt(newBlocks[0].block_height);
                const newBlockHeights = new Set(
                  newBlocks.map((b) => parseInt(b.block_height)),
                );

                // Robust Gap Detection: Check every height between old latest and new latest
                if (latestHeightRef.current !== null) {
                  const startHeight: number =
                    (latestHeightRef.current as number) + 1;
                  const endHeight: number = newestHeight;

                  // If we have advanced
                  if (endHeight >= startHeight) {
                    const missingHeights: number[] = [];
                    const MAX_BACKFILL = 5; // Reduced limit to prevent request flooding
                    let checkedCount = 0;

                    // Scan backwards from newest to (old_latest + 1)
                    for (let h = endHeight; h >= startHeight; h--) {
                      if (checkedCount >= MAX_BACKFILL) break;

                      if (!newBlockHeights.has(h)) {
                        missingHeights.push(h);
                      }
                      checkedCount++;
                    }

                    if (missingHeights.length > 0) {
                      console.log(
                        `[WebSocket] Detected missing blocks: ${missingHeights.join(", ")}. Backfilling...`,
                      );
                      try {
                        // Fetch missing blocks in parallel, resilient to individual failures
                        const backfillPromises = missingHeights.map(
                          async (h) => {
                            try {
                              return await state.aptos_client.getBlockByHeight(
                                h,
                                false,
                              );
                            } catch (e) {
                              console.warn(
                                `[WebSocket] Failed to backfill block ${h}`,
                                e,
                              );
                              return null;
                            }
                          },
                        );

                        const results = await Promise.all(backfillPromises);
                        backfilledBlocks = results.filter((b) => b !== null);
                      } catch (err) {
                        console.error(
                          "[WebSocket] Backfill process error",
                          err,
                        );
                      }
                    }
                  }
                }

                // Update ref
                if (
                  latestHeightRef.current === null ||
                  newestHeight > latestHeightRef.current
                ) {
                  latestHeightRef.current = newestHeight;
                }

                setBlocks((prev) => {
                  // Combine all sources: new WS blocks + backfilled + existing
                  const allNew = [...newBlocks, ...backfilledBlocks];

                  // Filter duplicates
                  const uniqueNewBlocks = allNew.filter(
                    (b) => !seenBlockHeights.current.has(b.block_height),
                  );
                  uniqueNewBlocks.forEach((b) =>
                    seenBlockHeights.current.add(b.block_height),
                  );

                  if (uniqueNewBlocks.length === 0) return prev;

                  // Prepend, Sort, and Slice
                  const updated = [...uniqueNewBlocks, ...prev]
                    .sort(
                      (a, b) =>
                        parseInt(b.block_height) - parseInt(a.block_height),
                    )
                    .slice(0, MAX_LOG_ITEMS);

                  return updated;
                });
              }
              break;

            case "transaction":
              if (msg.data.transactions && msg.data.transactions.length > 0) {
                const newTxs = msg.data.transactions.reverse(); // Newest first
                setTransactions((prev) => {
                  const uniqueNewTxs = newTxs.filter((tx) => {
                    const v = "version" in tx ? tx.version : null;
                    return v ? !seenTxVersions.current.has(v) : true;
                  });

                  uniqueNewTxs.forEach((tx) => {
                    const v = "version" in tx ? tx.version : null;
                    if (v) seenTxVersions.current.add(v);
                  });

                  if (uniqueNewTxs.length === 0) return prev;

                  const updated = [...uniqueNewTxs, ...prev].slice(
                    0,
                    MAX_LOG_ITEMS,
                  );
                  return updated;
                });
              }
              break;

            case "pong":
              break;
          }
        } catch (err) {
          console.error("[WebSocket] Parse error", err);
        }
      };

      ws.onclose = () => {
        console.log("[WebSocket] Disconnected");
        setIsConnected(false);
        if (heartbeatInterval) clearInterval(heartbeatInterval);
      };

      ws.onerror = (err) => {
        console.error("[WebSocket] Error", err);
      };
    };

    // Start initialization
    init();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "unsubscribe",
              id: "explorer-unsub",
              params: {channel: CHANNEL},
            }),
          );
          wsRef.current.close();
        } else {
          wsRef.current.close();
        }
      }
    };
  }, [fetchInitialData, state.aptos_client]);

  return {blocks, transactions, isConnected};
}
