import { CONTINENTS, COORDINATES, GenericProviderConfig } from "@yasf-serverless/core";
import { Construct } from "constructs";
import { GoogleProvider, GoogleProviderConfig } from "@cdktf/provider-google";

export class GenericGCPProvider extends GoogleProvider {
    constructor(scope: Construct, config: GenericProviderConfig, id: string = "gcp") {
        // Translates location config to GCP Region format
        const continent = CONTINENTS[config.continent].toLowerCase()
        const coordinates = COORDINATES[config.coordinates].toLowerCase()
        const region = `${continent}-${coordinates}${config.location}`

        // We can use AppOptions' context to store any configuration settings that needs shared between components
        const googleConfig: GoogleProviderConfig = {
            region: region,
            project: scope.node.tryGetContext('googleProjectId')
        }
        scope.node.setContext('googleRegion', region)
        super(scope, id, googleConfig)
    }
}
