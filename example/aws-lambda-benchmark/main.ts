import config from "./config/config";
import { App } from "cdktf";
import { Construct } from "constructs";
import {
    CONTINENTS, COORDINATES, RUNTIMES, FunctionAssets, GenericFunction, GenericNoSQLDatabase,
    GenericProvider, GenericStack, IGenericFunction, populateResolvers
} from "@yasf-serverless/core"

class ExampleStack extends GenericStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new GenericProvider(this, {
            continent: CONTINENTS.Europe,
            coordinates: COORDINATES.West,
            location: "2",
        })

        const productsDb = new GenericNoSQLDatabase(this, "products-db", {
            primaryKey: "sku",
        })

        const functionAssets = new FunctionAssets({
            path: "build",
            archiveName: "src.zip",
            bundlingCommands: [
                "mkdir -p build && rm -rf build/* && cp -r src/app/* build/ && cp src/requirements.txt build/",
                "pip install -r src/requirements-local.txt -t build/",
                "cd build && zip -r src.zip ."
            ],
        })

        const createFunction = (id: string, name: string): IGenericFunction => new GenericFunction(this, id, {
            runtime: RUNTIMES.PYTHON39,
            handler: "handler",
            functionAssets: functionAssets,
            entrypoint: name,
            envVariables: {
                "PRODUCTS_TABLE": productsDb.name,
            }
        })

        const createProductFunction = createFunction("create-product", "createProduct")
        const getProductFunction = createFunction("get-product", "getProduct")
        const updateProductFunction = createFunction("update-product", "updateProduct")
        const deleteProductFunction = createFunction("delete-product", "deleteProduct")
        const listProductsFunction = createFunction("list-products", "listProducts");

        [createProductFunction, getProductFunction, updateProductFunction, deleteProductFunction, listProductsFunction].forEach((functionInstance) => {
            db.grantReadWriteAccess(functionInstance)
        })
    }
}

populateResolvers().then(() => {
    const app = new App({
        context: config
    });
    new ExampleStack(app, "lambda-benchmark");

    app.synth();
})