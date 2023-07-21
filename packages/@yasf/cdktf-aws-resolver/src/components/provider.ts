import { CONTINENTS, COORDINATES, GenericProviderConfig } from "@yasf-serverless/core";
import { Construct } from "constructs";
import { AwsProvider, AwsProviderConfig } from "@cdktf/provider-aws";

// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions
const continentsMap = {
    [CONTINENTS.ASIA]: "ap",
    [CONTINENTS.Europe]: "eu",
    [CONTINENTS.NorthAmerica]: "us",
    [CONTINENTS.US]: "us",
    [CONTINENTS.SouthAmerica]: "sa",
}

export class GenericAwsProvider extends AwsProvider {
    constructor(scope: Construct, config: GenericProviderConfig, id: string = "aws") {
        // Translates location config to AWS Region format
        const continent = continentsMap[config.continent]
        const coordinates = COORDINATES[config.coordinates].toLowerCase()
        const region = `${continent}-${coordinates}-${config.location}`

        const awsConfig: AwsProviderConfig = {
            region: region
        }

        super(scope, id, awsConfig)
    }
}
