import { GenericFunctionConfig, IGenericFunction, RUNTIMES } from "@yasf/core";
import { Construct } from "constructs";
import { LambdaFunction, LambdaFunctionConfig, LambdaFunctionUrl } from "@cdktf/provider-aws/lib/lambdafunction";
import { IamRole, IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam";
import { AssetType, TerraformAsset } from "cdktf";
import * as path from "path";

const lambdaRolePolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
};

const runtimesMap = {
    [RUNTIMES.NODEJS16]: "nodejs16.x",
    [RUNTIMES.NODEJS14]: "nodejs14.x",
    [RUNTIMES.NODEJS12]: "nodejs12.x",
    [RUNTIMES.NODEJS10]: "nodejs10.x",
    [RUNTIMES.PYTHON39]: "python3.9",
    [RUNTIMES.PYTHON38]: "python3.8",
    [RUNTIMES.PYTHON37]: "python3.7",
    [RUNTIMES.JAVA11]: "java11",
    [RUNTIMES.DOTNET3]: "dotnetcore3.1",
}

// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
// TODO: min ram, architecture
export class GenericLambdaFunction extends LambdaFunction implements IGenericFunction {
    readonly grantReference: string;

    constructor(scope: Construct, id: string, config: GenericFunctionConfig) {
        // Create Lambda role
        const role = new IamRole(scope, `lambda-${id}-exec-role`, {
            assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
        })

        // Add execution role for lambda to write to CloudWatch logs
        new IamRolePolicyAttachment(scope, `lambda-${id}-managed-policy`, {
            policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            role: role.name
        });

        const assets = config.functionAssets

        const archiveFile = new TerraformAsset(scope, `lambda-${id}function-asset`, {
            path: path.resolve(`${assets.path}/${assets.archiveName}`),
            type: AssetType.FILE
        })

        // handler and runtime must be set when PackageType is Zip
        // filename, s3_* or image_uri attributes must be set
        const lambdaConfig: LambdaFunctionConfig = {
            functionName: config.name ?? id,
            role: role.arn,
            handler: `${config.entrypoint}.${config.handler}`,
            runtime: runtimesMap[config.runtime],
            filename: archiveFile.path,
            environment: {
                variables: {
                    PROVIDER: 'AWS',
                    ...config.envVariables
                }
            }
        }
        super(scope, id, lambdaConfig)
        this.grantReference = role.name

        // Generates hash to update function when code changes
        this.addOverride('source_code_hash', `filebase64sha256(${archiveFile.path})`)

        new LambdaFunctionUrl(scope, `${id}-url`, {
            functionName: this.functionName,
            authorizationType: "AWS_IAM"
        })

    }
}
