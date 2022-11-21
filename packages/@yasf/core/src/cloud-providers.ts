import { Actions } from "./actions/actions";
import { Components } from "./components/components";
const { cosmiconfig } = require('cosmiconfig');
const resolveFrom = require('resolve-from');

let resolvers: { [name: string]: any } = {};

const CONFIG_NAME = 'yasf';

function loadResolver(name: string) {
    const resolvedPath = resolveFrom.silent(__dirname, name)
    return require(resolvedPath)
}

export async function populateResolvers() {
    const { config } = await cosmiconfig(CONFIG_NAME).search() || {};
    const resolverNames: [string] = config.resolvers || [];
    resolverNames.forEach((resolverName) => {
        const resolver = loadResolver(resolverName)
        resolvers[resolverName] = resolver
    });
    return resolvers
}

export function getResolverComponents(resolverName: string): Components {
    return resolvers[resolverName].ResolverComponents;
}

export function getResolverActions(resolverName: string): Actions {
    return resolvers[resolverName].ResolverActions;
}