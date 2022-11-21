import { Components } from "@yasf/core"
import { GenericAwsProvider } from "./provider";
import { GenericLambdaFunction } from "./lambda";
import { App, TerraformStack } from "cdktf";
import { GenericDynamoTable } from "./no-sql-db";

export const ResolverComponents: Components = {
    providerCode: "aws",
    provider: GenericAwsProvider,
    function: GenericLambdaFunction,
    stack: TerraformStack,
    app: App,
    noSQLDatabase: GenericDynamoTable
}
