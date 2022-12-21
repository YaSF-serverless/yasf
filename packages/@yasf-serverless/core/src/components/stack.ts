import { Construct } from "constructs";
import { getResolverComponents } from "../cloud-providers";

export class GenericStack extends Construct {
    constructor(scope: Construct, name: string) {
        super(undefined as any, "");
        const providerKey = scope.node.tryGetContext('provider')
        return new (getResolverComponents(providerKey)).stack(scope, `${name}-${getResolverComponents(providerKey).providerCode}`)
    }
}