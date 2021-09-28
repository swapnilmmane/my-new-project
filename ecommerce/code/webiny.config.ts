import { startApp, buildApp } from "@webiny/project-utils";
import invariant from "invariant";
import { getStackOutput } from "@webiny/cli-plugin-deploy-pulumi/utils";

const MAP = {
    REACT_APP_GRAPHQL_API_URL: "${apiUrl}/graphql",
    REACT_APP_CMS_API_URL: "${apiUrl}"
};

const NO_API_MESSAGE = env => {
    return `It seems that the API project application isn't deployed!\nBefore continuing, please deploy it by running the following command: yarn webiny deploy api --env=${env}`;
};

// Exports fundamental watch and build commands.
// Need to inject environment variables or link your application with an existing GraphQL API?
// See https://www.webiny.com/docs/how-to-guides/scaffolding/react-application#linking-the-react-application-with-a-graphql-api.
export default {
    
    
    commands: {
        async watch(options, context) {
            // Starts local application development.
            const output = await getStackOutput("api", options.env, MAP);
            invariant(output, NO_API_MESSAGE(options.env));
            Object.assign(process.env, getStackOutput("api", options.env, MAP));
            
            await startApp(options, context);
        },
        async build(options, context) {
            // Creates a production build of your application, ready to be deployed to
            // a hosting provider of your choice, for example Amazon S3.
            
            const output = await getStackOutput("api", options.env, MAP);
            invariant(output, NO_API_MESSAGE(options.env));
            Object.assign(process.env, getStackOutput("api", options.env, MAP));
            
            await buildApp(options, context);
        }
    }
};
