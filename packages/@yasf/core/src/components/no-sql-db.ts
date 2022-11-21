import { Construct, IConstruct } from "constructs";
import { getResolverComponents } from "../cloud-providers";
import { IGenericGrantable } from "./generic-constructs";

export interface GenericNoSQLDatabaseConfig {
    /**
     * The name that will be assigned to the Database.
     *
     */
    readonly name?: string

    /**
     * The primary key of the Database.
     * 
     */
    readonly primaryKey: string
}

export interface IGenericNoSQLDatabase extends IConstruct {
    readonly name: string;

    grantReadWriteAccess(resource: IGenericGrantable): void
}


export const GenericNoSQLDatabase = function (scope: Construct, id: string, config: any) {
    const providerKey = scope.node.tryGetContext('provider')
    return new (getResolverComponents(providerKey)).noSQLDatabase(scope, id, config)
} as unknown as new (scope: Construct, id: string, config: any) => IGenericNoSQLDatabase

