import React, {useEffect, useState} from "react";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {getApiKey, NetworkName} from "../../constants";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {ApolloProvider} from "@apollo/client/react";

function getIsGraphqlClientSupportedFor(networkName: NetworkName): boolean {
  const graphqlUri = getGraphqlURI(networkName);
  return typeof graphqlUri === "string" && graphqlUri.length > 0;
}

export function getGraphqlURI(networkName: NetworkName): string | undefined {
  switch (networkName) {
    case "mainnet":
      return "https://api.mainnet.aptoslabs.com/v1/graphql";
    case "testnet":
      return "https://api.testnet.staging.aptoslabs.com/v1/graphql";
    case "devnet":
      return "https://devnet-storage.crustle.xyz/v1/graphql"; // Use your custom indexer
    case "decibel":
      return "https://api.netna.staging.aptoslabs.com/v1/graphql";
    case "shelbynet":
      return "https://api.shelbynet.staging.shelby.xyz/v1/graphql";
    case "local":
      return "https://devnet-storage.crustle.xyz/v1/graphql"; // Use your custom indexer
    default:
      return undefined;
  }
}

function getGraphqlClient(networkName: NetworkName): ApolloClient {
  const apiKey = getApiKey(networkName);
  // Middleware to attach the authorization token and Hasura admin secret.
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({headers = {}}) => ({
      headers: {
        ...headers,
        ...(apiKey ? {authorization: `Bearer ${apiKey}`} : {}),
        // Add Hasura admin secret for custom devnet/local networks
        ...(networkName === "devnet" || networkName === "local"
          ? {"x-hasura-admin-secret": "myadminsecret"}
          : {}),
      },
    }));
    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri: getGraphqlURI(networkName),
  });

  return new ApolloClient({
    link: ApolloLink.from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function useGetGraphqlClient() {
  const [state] = useGlobalState();
  const [graphqlClient, setGraphqlClient] = useState<ApolloClient>(
    getGraphqlClient(state.network_name),
  );

  useEffect(() => {
    setGraphqlClient(getGraphqlClient(state.network_name));
  }, [state.network_name]);

  return graphqlClient;
}

type GraphqlClientProviderProps = {
  children: React.ReactNode;
};

export function GraphqlClientProvider({children}: GraphqlClientProviderProps) {
  const graphqlClient = useGetGraphqlClient();

  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
}

export function useGetIsGraphqlClientSupported(): boolean {
  const [state] = useGlobalState();
  return getIsGraphqlClientSupportedFor(state.network_name);
}
