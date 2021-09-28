import React from "react";
import { RoutePlugin } from "@webiny/app/plugins/RoutePlugin";
import { Link, Route } from "@webiny/react-router";
import { Empty } from "antd";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Columned from "react-columned";
import Layout from "~/components/Layout";
import blankImage from "~/images/blankImage.png";
/*
const LIST_PRODUCTS = gql`
    query { security {
    listUsers {
      data {
        login
        firstName
        createdOn
      }
    }
    }
  }
`;*/

const LIST_PRODUCTS = gql`
    query {
        listContentModels {
            data {
            name
            modelId
            }
        }
    }

`;

// The home page.
const Home: React.FC = () => {
    const listProductsQuery = useQuery(LIST_PRODUCTS);
    console.log("===== 25 listProductsQuery" , listProductsQuery);
    const { data = [] } = listProductsQuery?.data || {};

    return (
        <Layout className={"home"}>
            Hi
            
            {data.length > 0 ? (
                /* If we have pins to show, use the `Columned` component to render them in a mosaic layout. */
                <Columned>
                    {data.map(item => (
                        /* Every pin should link to its details page. */
                        <Link key={item.sku} to={"/product/" + item.sku}>
                            {/* If the pin contains an image, we show it. Otherwise, we show a placeholder image. */}
                            <img
                                title={item.name}
                                alt={item.name}
                                src={item.mainImage || blankImage}
                            />
                        </Link>
                    ))}
                </Columned>
            ) : (
                /* If there are no pins to show, render "Nothing to show." message. */
                <Empty description={"Nothing to show."} />
            )}
        </Layout>
    );
};

// We register routes via the `RoutePlugin` plugin.
export default new RoutePlugin({
    route: <Route path="/" exact component={Home} />
});