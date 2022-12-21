import { Construct, IConstruct } from "constructs";
import { GenericAppOptions } from "./app";
import { GenericFunctionConfig, IGenericFunction } from "./function";
import { IGenericNoSQLDatabase } from "./no-sql-db";

export interface IResourceConstruct {
    new(scope: Construct, id: string, config: any): Construct
}

export interface IProviderConstruct {
    new(scope: Construct, config: any, id?: string): Construct
}

export interface IStackConstruct {
    new(scope: Construct, name: string): Construct
}

export interface IAppConstruct {
    new(options: GenericAppOptions): Construct
}

export interface IFunctionConstruct {
    new(scope: Construct, id: string, config: GenericFunctionConfig): IGenericFunction
}

export interface INoSQLDatabaseConstruct {
    new(scope: Construct, id: string, config: any): IGenericNoSQLDatabase
}

export interface IGenericGrantable extends IConstruct {
    grantReference: string
}