import { getResolverActions, populateResolvers } from '../cloud-providers';
import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
    target: string | undefined;
};

export const command: string = 'deploy [target]';
export const desc: string = 'Deploy the selected target or all targets';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .positional('target', { type: 'string', demandOption: false });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
    const resolvers = await populateResolvers()
    const { target } = argv;
    if (target) {
        process.env.PROVIDER = target;
        const resolverActions = getResolverActions(target)
        await resolverActions.execute()
    } else {
        for (const resolver in resolvers) {
            process.env.PROVIDER = resolver;
            const resolverActions = getResolverActions(resolver)
            await resolverActions.execute()
        }
    }
    process.exit(0);
};