import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import type { GraphQLFormattedError } from "graphql";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  let token = null;
  try {
    const tokenItem = localStorage.getItem("token");
    token = tokenItem ? JSON.parse(tokenItem) : null;
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLFormattedError) => {
      const { message, locations, path } = error;
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
      if (message.includes("Unauthorized") || message.includes("jwt")) {
        localStorage.removeItem("token");
        apolloClient.cache.reset();
        window.location.href = "/login";
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
});

export const clearApolloCache = () => {
  apolloClient.cache.reset();
};
