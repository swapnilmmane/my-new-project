import { ConsoleLinkPlugin } from "@webiny/app/plugins/ConsoleLinkPlugin";
import { NetworkErrorLinkPlugin } from "@webiny/app/plugins/NetworkErrorLinkPlugin";
import { OmitTypenameLinkPlugin } from "@webiny/app/plugins/OmitTypenameLinkPlugin";
import { ApolloLinkPlugin } from "@webiny/app/plugins/ApolloLinkPlugin";
import { setContext } from "apollo-link-context";

export default [
    // This link removes `__typename` from the variables being sent to the API.
    new OmitTypenameLinkPlugin(),

    // This link checks for presence of `extensions.console` in the response and logs all items to browser console.
    new ConsoleLinkPlugin(),

    // This plugin creates an ApolloLink that checks for `NetworkError` and shows an ErrorOverlay in the browser.
    new NetworkErrorLinkPlugin(),
    
    new ApolloLinkPlugin(() => {
        return setContext(async (_, { headers }) => {
          try {
            return {
              headers: {
                ...headers,
                Authorization: "sa0e2c84c62df2838e45927a31655f99c700ea98111cb0275",
              },
            };
          } catch (error) {
            return { headers };
          }
        });
      }),
];
