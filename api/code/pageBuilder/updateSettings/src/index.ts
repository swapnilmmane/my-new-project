import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createHandler } from "@webiny/handler-aws";
import dbPlugins from "@webiny/handler-db";
import { DynamoDbDriver } from "@webiny/db-dynamodb";
import updateSettingsPlugins from "@webiny/api-page-builder/updateSettings";
import pageBuilderDynamoDbElasticsearchPlugins from "@webiny/api-page-builder-so-ddb-es";

const debug = process.env.DEBUG === "true";
export const handler = createHandler({
    plugins: [
        updateSettingsPlugins(),
        dbPlugins({
            table: process.env.DB_TABLE,
            driver: new DynamoDbDriver({
                documentClient: new DocumentClient({
                    convertEmptyValues: true,
                    region: process.env.AWS_REGION
                })
            })
        }),
        pageBuilderDynamoDbElasticsearchPlugins()
    ],
    http: { debug }
});
