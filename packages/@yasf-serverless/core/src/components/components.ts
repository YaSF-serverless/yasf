import { IAppConstruct, IFunctionConstruct, INoSQLDatabaseConstruct, IProviderConstruct, IStackConstruct } from "./generic-constructs";

export type Components = {
    providerCode: string
    provider: IProviderConstruct
    function: IFunctionConstruct,
    stack: IStackConstruct,
    app: IAppConstruct,
    noSQLDatabase: INoSQLDatabaseConstruct,
}
