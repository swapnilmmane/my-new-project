import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { plugins } from "@webiny/plugins";

// Loaded in ecommerce/code/webiny.config.ts.
const CMS_API_TOKEN = process.env.REACT_APP_CMS_API_TOKEN;

let client;

export default () => {
    console.log("==== 13")
    if (client) {
        return client;
    }

    const isProduction = process.env.NODE_ENV === "production";

    const cache = new InMemoryCache({
        addTypename: true,
        dataIdFromObject: obj => obj.id || null
    });

    if (isProduction && process.env.REACT_APP_ENV === "browser") {
        // Production build of this app will be rendered using SSR so we need to restore cache from pre-rendered state.
        // @ts-ignore
        cache.restore(window.__APOLLO_STATE__);
    }

    // @ts-ignore
    cache.restore("__APOLLO_STATE__" in window ? window.__APOLLO_STATE__ : {});

    const authLink = new ApolloLink((operation, forward) => {
        // Use the setContext method to set the HTTP headers.
        console.log("===== 36 adding the API token ", CMS_API_TOKEN);
        operation.setContext({
            headers: {
                authorization: `Bearer ${CMS_API_TOKEN}`
            }
        });

        // Call the next link in the middleware chain.
        return forward(operation);
    });

    const uri = process.env.REACT_APP_API_URL + "/cms/read/en-US";
    // https://www.apollographql.com/docs/react/api/link/introduction/#additive-composition
    const link = ApolloLink.from([
        // why the line below
        ...plugins.byType("apollo-link").map(pl => pl.createLink()),
        authLink,
        new BatchHttpLink({ uri })
    ]);

    // @ts-ignore
    window.getApolloState = () => {
        // @ts-ignore
        return cache.data.data;
    };

    client = new ApolloClient({ link, cache });
    return client;
};
