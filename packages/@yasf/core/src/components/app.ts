import { getResolverComponents } from "../cloud-providers";

export interface GenericAppOptions {
    readonly context: {
        [key: string]: any;
    };
}

export class GenericApp {
    constructor(options: GenericAppOptions) {
        const providerKey = options.context['provider']
        return new (getResolverComponents(providerKey)).app(options)
    }
}