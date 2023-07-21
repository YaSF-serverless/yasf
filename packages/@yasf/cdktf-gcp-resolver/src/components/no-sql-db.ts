
import { AppEngineApplication, DataGoogleAppEngineDefaultServiceAccount } from "@cdktf/provider-google";
import { GenericNoSQLDatabaseConfig, IGenericGrantable, IGenericNoSQLDatabase } from "@yasf-serverless/core";
import { Construct } from "constructs";


export class GenericFirestore extends Construct implements IGenericNoSQLDatabase {
    readonly name: string;

    constructor(scope: Construct, id: string, config: GenericNoSQLDatabaseConfig) {

        // Temporary workaround described here
        // https://github.com/hashicorp/terraform-provider-google/issues/10351#issuecomment-1116555590
        const serviceAccount = new DataGoogleAppEngineDefaultServiceAccount(scope, `${id}-service-account`)
        if (!serviceAccount.uniqueId) {
            new AppEngineApplication(scope, `${id}-app-engine`, {
                locationId: scope.node.tryGetContext('googleRegion'),
                databaseType: "CLOUD_FIRESTORE",
            })
        }

        super(scope, id)
        this.name = config.name ?? id
    }

    // No need to grant access to Firestore
    grantReadWriteAccess(resource: IGenericGrantable): void { }
}
