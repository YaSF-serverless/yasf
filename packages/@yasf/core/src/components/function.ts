import { spawnSync } from "child_process";
import { Construct } from "constructs";
import * as os from "os";
import { getResolverComponents } from "../cloud-providers";
import { IGenericGrantable } from "./generic-constructs";

export enum RUNTIMES {
    NODEJS16,
    NODEJS14,
    NODEJS12,
    NODEJS10,
    PYTHON39,
    PYTHON38,
    PYTHON37,
    JAVA11,
    DOTNET3
}

export class FunctionAssets {
    /**
     * The relative path of the zip package to upload
     *
     */
    readonly path: string

    /**
     * The filename of the zip package to upload
     *
     */
    readonly archiveName: string

    /**
     * The list of commands used to package the function
     * 
     */
    readonly bundlingCommands?: string[]


    constructor(config: { path: string, archiveName: string, bundlingCommands?: string[] }) {
        this.path = config.path
        this.archiveName = config.archiveName

        if (config.bundlingCommands) {
            this.bundlingCommands = config.bundlingCommands
            const chainedCommands = config.bundlingCommands.filter(c => !!c).join(' && ');
            const osPlatform = os.platform()

            const proc = spawnSync(
                osPlatform === 'win32' ? 'cmd' : 'bash',
                [
                    osPlatform === 'win32' ? '/c' : '-c',
                    chainedCommands
                ],
            )

            if (proc.error) {
                throw proc.error;
            }
        }
    }

}

export interface GenericFunctionConfig {
    /**
     * The name that will be assigned to the Function
     *
     */
    readonly name?: string

    /**
     * The execution runtime of the Function
     *
     * Note: not all versions are supported by each cloud providers
     */
    readonly runtime: RUNTIMES

    /**
     * The handler of the function to be executed
     *
     */
    readonly handler: string

    /**
     * The filename of the entrypoint function
     *
     */
    readonly entrypoint: string

    /**
     * The environment variables to be passed to the function
     *
     * Note: the variable `PROVIDER` will be automatically set by the framework
     * 
     */
    readonly envVariables?: {
        [key: string]: string;
    };

    readonly functionAssets: FunctionAssets
}

export interface IGenericFunction extends IGenericGrantable { }


export const GenericFunction = function (scope: Construct, id: string, config: GenericFunctionConfig) {
    const providerKey = scope.node.tryGetContext('provider')
    return new (getResolverComponents(providerKey)).function(scope, id, config)
} as unknown as new (scope: Construct, id: string, config: GenericFunctionConfig) => IGenericFunction

