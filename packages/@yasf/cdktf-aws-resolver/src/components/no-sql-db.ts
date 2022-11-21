import { DynamodbTable } from "@cdktf/provider-aws/lib/dynamodb";
import { IamPolicy, IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam";
import { GenericNoSQLDatabaseConfig, IGenericGrantable } from "@yasf/core";
import { Construct } from "constructs";

const writeReadRolePolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": ""
        }
    ]
};

export class GenericDynamoTable extends DynamodbTable {
    constructor(scope: Construct, id: string, config: GenericNoSQLDatabaseConfig) {
        super(scope, id, {
            name: id ?? config.name,
            readCapacity: 1,
            writeCapacity: 1,
            attribute: [{
                name: config.primaryKey,
                type: "S"
            }],
            hashKey: config.primaryKey
        })
    }

    grantReadWriteAccess(resource: IGenericGrantable) {
        writeReadRolePolicy.Statement[0].Resource = this.arn;

        // Create a policy for the role to read and write to the table
        const policy = new IamPolicy(this, `${resource.node.id}-dynamodb-policy`, {
            policy: JSON.stringify(writeReadRolePolicy)
        });

        new IamRolePolicyAttachment(this, `${resource.node.id}-policy-attachment`, {
            policyArn: policy.arn,
            role: resource.grantReference
        });
    }
}
