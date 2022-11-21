import { Construct } from "constructs";
import { getResolverComponents } from "../cloud-providers";

export enum CONTINENTS {
    ASIA,
    Europe,
    NorthAmerica,
    SouthAmerica,
    US,
}

export enum COORDINATES {
    East,
    West,
    South,
    North,
    SouthEast,
    NorthEast,
    Central
}

// TODO: custom config should be supported for not-yet implemented parameters
export interface GenericProviderConfig {
    /**
     * The region where operations will take place.
     *
     */
    readonly continent: CONTINENTS;

    /**
     * The sub-region where operations will take place.
     *
     * Note: Some locations are not consistent among Cloud Providers.
     * Custom locations can be set to override default conversion.
     *
     */
    readonly coordinates: COORDINATES;

    /**
     * The location number where operations will take place.
     *
     * This is generally an integer
     *
     */
    readonly location: string

}

export class GenericProvider {
    constructor(scope: Construct, config: GenericProviderConfig, id?: string) {
        const providerKey = scope.node.tryGetContext('provider')
        return new (getResolverComponents(providerKey)).provider(scope, config, id ?? providerKey)
    }
}