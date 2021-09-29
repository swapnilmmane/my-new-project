import React from "react";
import { ApolloProvider } from "@apollo/react-components";
import { Routes } from "@webiny/app/components/Routes";
import { BrowserRouter } from "@webiny/react-router";
import { createApolloClient } from "./apollo";

// An entrypoint for all SCSS styles your application might have.
import "./App.scss";
import "antd/dist/antd.css";

// The beginning of our React application, where we mount a couple of useful providers.
// If needed, feel free to add new or modify existing providers.
export const App = () => (
    <>
        {/* Sets up a new Apollo GraphQL client, pointed to an existing GraphQL API. 
        <ApolloProvider client={createApolloClient({ uri: process.env.REACT_APP_GRAPHQL_API_URL })}>
        */}
        {/* <    client={createApolloClient({ uri: process.env.REACT_APP_CMS_API_URL + '/cms/read/en-US'})}>  */}
            {/* Enables routing in our application. */}
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes />
            </BrowserRouter>
        {/* </ApolloProvider> */}
    </>
);
