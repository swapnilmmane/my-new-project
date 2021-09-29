import { plugins } from "@webiny/plugins";
import apolloLinkPlugins from "./apollo";
import home from "./routes/home";
import notFound from "./routes/notFound";

// Imports and registers all defined plugins.
plugins.register([
    // Various Apollo client plugins.
    // check if you uncomment it, if it still work?
    apolloLinkPlugins,

    // Application routes.
    home,
    notFound
]);
