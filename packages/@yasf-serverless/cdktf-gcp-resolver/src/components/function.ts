import { GenericFunctionConfig, IGenericFunction, RUNTIMES } from "@yasf-serverless/core";
import { Construct } from "constructs";
import {
    CloudfunctionsFunction,
    CloudfunctionsFunctionConfig,
    StorageBucket,
    StorageBucketObject
} from "@cdktf/provider-google";
import { AssetType, TerraformAsset } from "cdktf";
import * as path from "path";


export class GenericGoogleFunction extends CloudfunctionsFunction implements IGenericFunction {
    readonly grantReference: string;

    constructor(scope: Construct, id: string, config: GenericFunctionConfig) {
        // Build required bucket to upload the function
        const region = scope.node.tryGetContext('googleRegion');
        const bucket = new StorageBucket(scope, `${id}-bucket`, {
            name: `${config.name ?? id}-source-archive`,
            location: region,
        })

        const assets = config.functionAssets

        const archiveFile = new TerraformAsset(scope, `${id}-function-asset`, {
            path: path.resolve(`${assets.path}/${assets.archiveName}`),
            type: AssetType.FILE
        })

        const bucketObject = new StorageBucketObject(scope, `${id}-object`, {
            name: `${archiveFile.assetHash}-${assets.archiveName}`,
            bucket: bucket.name,
            source: archiveFile.path
        })

        const cloudFunctionsConfig: CloudfunctionsFunctionConfig = {
            name: config.name ?? id,
            runtime: RUNTIMES[config.runtime].toLowerCase(),
            sourceArchiveBucket: bucket.name,
            sourceArchiveObject: bucketObject.name,
            triggerHttp: true,
            entryPoint: config.handler,
            ingressSettings: 'ALLOW_ALL',
            buildEnvironmentVariables: {
                GOOGLE_FUNCTION_SOURCE: `${config.entrypoint}.py`,
            },
            environmentVariables: {
                PROVIDER: 'GCP',
                ...config.envVariables
            },
        }

        super(scope, id, cloudFunctionsConfig)
        this.grantReference = ''
    }
}
