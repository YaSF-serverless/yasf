import { IConstruct } from "constructs";
import { getResolverComponents } from "../cloud-providers";

export interface GenericAppOptions {
    readonly context: {
        [key: string]: any;
    };
}

export interface IGenericApp extends IConstruct {
    synth(): void;
}

export const GenericApp = function (options: GenericAppOptions) {
    const providerKey = options.context['provider']
    return new (getResolverComponents(providerKey)).app(options)
} as unknown as new (options: GenericAppOptions) => IGenericApp
