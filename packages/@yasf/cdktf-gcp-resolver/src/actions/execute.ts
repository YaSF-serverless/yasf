import { TerraformCli } from 'cdktf-cli/lib/models/terraform-cli';
import { SynthStack } from "cdktf-cli/lib/synth-stack"
import { AbortController } from "node-abort-controller"

export async function execute() {
    const ac = new AbortController();
    const abortSignal = ac.signal;

    const synthStacks = await SynthStack.synth(
        abortSignal,
        "node main.js",
        "cdktf.out"
    )
    let error = false;
    const cli = new TerraformCli(abortSignal, synthStacks[0],
        (_phase) => (stdout, _isErr) => {
            console.log(stdout);
            error = error || Boolean(_isErr);
        });

    if (!error) await cli.init()
    if (!error) await cli.deploy('')
}
