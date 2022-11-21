import { Components } from "@yasf/core"
import { GenericGCPProvider } from "./provider";
import { GenericGoogleFunction } from "./function";
import { App, TerraformStack } from "cdktf";
import { GenericFirestore } from "./no-sql-db";

export const ResolverComponents: Components = {
    providerCode: "gcp",
    provider: GenericGCPProvider,
    function: GenericGoogleFunction,
    stack: TerraformStack,
    app: App,
    noSQLDatabase: GenericFirestore
}
