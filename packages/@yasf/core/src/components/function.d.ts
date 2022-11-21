import { Construct } from "constructs";
export declare enum RUNTIMES {
    NODEJS16 = 0,
    NODEJS14 = 1,
    NODEJS12 = 2,
    NODEJS10 = 3,
    PYTHON39 = 4,
    PYTHON38 = 5,
    PYTHON37 = 6,
    JAVA11 = 7,
    DOTNET3 = 8
}
export interface GenericFunctionConfig {
    /**
     * The name that will be assigned to the Function
     *
     */
    readonly name?: string;
    /**
     * The execution runtime of the Function
     *
     * Note: not all versions are supported by each cloud providers
     */
    readonly runtime: RUNTIMES;
    /**
     * The handler of the function to be executed
     *
     */
    readonly handler: string;
    /**
     * The relative path of the zip package to upload
     *
     */
    readonly filename: string;
}
export declare abstract class GenericFunction {
    static create(_scope: Construct, _id: string, _config: GenericFunctionConfig): Construct;
}
