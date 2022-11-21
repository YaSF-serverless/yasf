import { Construct } from "constructs";
import { TerraformProvider } from "cdktf";
export declare enum CONTINENTS {
    ASIA = 0,
    Europe = 1,
    NorthAmerica = 2,
    SouthAmerica = 3,
    US = 4
}
export declare enum COORDINATES {
    East = 0,
    West = 1,
    South = 2,
    North = 3,
    SouthEast = 4,
    NorthEast = 5,
    Central = 6
}
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
    readonly location: string;
}
export declare abstract class GenericProvider {
    static create(_scope: Construct, _config: GenericProviderConfig, _id?: string): TerraformProvider;
}
