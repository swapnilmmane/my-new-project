import React from "react";
import { RoutePlugin } from "@webiny/app/plugins/RoutePlugin";
import { Route, Link, RouteChildrenProps } from "@webiny/react-router";
import { ReactComponent as WebinyLogo } from "../../images/webiny.svg";
import Layout from "../../components/Layout";

function MyNewPage(props: RouteChildrenProps) {
    return (
        <Layout className={"my-new-page"}>
            <h1>My New Page</h1>
            <h2>
                This is my new page.
            </h2>
            <Link to={"/"}> &larr; Back</Link>
        </Layout>
    );
}

// We register routes via the `RoutePlugin` plugin.
export default new RoutePlugin({
    route: <Route path="/my-new-page" exact component={MyNewPage} />
});