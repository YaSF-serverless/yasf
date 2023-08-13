import config from "./config/config";
import { App } from "cdktf";
import { Construct } from "constructs";
import {
    CONTINENTS, COORDINATES, RUNTIMES, FunctionAssets, GenericFunction,
    GenericProvider, GenericStack, populateResolvers
} from "@yasf-serverless/core"

class ExampleStack extends GenericStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new GenericProvider(this, {
            continent: CONTINENTS.Europe,
            coordinates: COORDINATES.West,
            location: "2",
        })

        const functionAssets = new FunctionAssets({
            path: "build",
            archiveName: "src.zip",
            bundlingCommands: [
                "mkdir -p build && rm -rf build/* && cp -r src/app/* build/",
                "pip install -r src/requirements-local.txt -t build/",
                "cd build && zip -r src.zip ."
            ],
        })

        new GenericFunction(this, "python-sort", {
            runtime: RUNTIMES.PYTHON39,
            handler: "hello",
            functionAssets: functionAssets,
            entrypoint: "handler",
        })
    }
}

populateResolvers().then(() => {
    const app = new App({
        context: config
    });
    new ExampleStack(app, "lambda-performance");

    app.synth();
})