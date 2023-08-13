import { FunctionAssets, GenericFunction, GenericNoSQLDatabase, GenericProvider, GenericStack, populateResolvers } from "@yasf-serverless/core"
import config from "./config/config";
import { App } from "cdktf";
import { Construct } from "constructs";
import { CONTINENTS, COORDINATES } from "@yasf-serverless/core"
import { RUNTIMES } from "@yasf-serverless/core"

class ExampleStack extends GenericStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new GenericProvider(this, {
            continent: CONTINENTS.Europe,
            coordinates: COORDINATES.West,
            location: "2",
        })

        const db = new GenericNoSQLDatabase(this, "db-example", {
            name: "db-example",
            primaryKey: "id",
        })

        const functionAssets = new FunctionAssets({
            path: "build",
            archiveName: "src.zip",
            bundlingCommands: [
                "mkdir -p build && rm -rf build/* && cp -r src/app/* build/ && cp src/requirements.txt build/",
                "cd build && zip -r src.zip ."
            ],
        })

        const serverlessFunc = new GenericFunction(this, "function-id", {
            runtime: RUNTIMES.PYTHON39,
            handler: "lambda_handler",
            functionAssets: functionAssets,
            entrypoint: "main",
            envVariables: {
                "DB_NAME": db.name,
            }
        })

        db.grantReadWriteAccess(serverlessFunc)
    }
}

populateResolvers().then(() => {
    const app = new App({
        context: config
    });
    new ExampleStack(app, "stack-name");

    app.synth();
})