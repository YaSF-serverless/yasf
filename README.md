# YaSF - Yet another Serverless Framework

YaSF is a serverless framework that aims to break vendor lock-in barriers while allowing the use of provider-specific functionalities.
This framework defines agnostic infrastructure based on the [Constructs Programming Model](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html) developed by AWS but also utilised in Terraform, Kubernetes and Projen.


# Usage

## 1. Import YaSF Core

To install the dependency, run:
```bash
npm i @yasf-serverless/core
```
or for yarn:
```bash
yarn add @yasf-serverless/core
```

## 2. Create your infrastructure
Use YaSF agnostic constructs to define your infrastructure. Currently YaSF is available in TypeScript. Here is an example of a stack deploying a Python serverless function:

```TypeScript
class ExampleStack extends GenericStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new GenericProvider(this, {
            continent: CONTINENTS.Europe,
            coordinates: COORDINATES.West,
            location: "2",
        })

        const functionAssets = new FunctionAssets({
            path: "build",
            archiveName: "src.zip",
            bundlingCommands: [
                "cp -r src/app/* build/",
                "cd build && zip -r src.zip ."
            ],
        })

        new GenericFunction(this, "function-example", {
            runtime: RUNTIMES.PYTHON39,
            handler: "lambda_handler",
            functionAssets: functionAssets,
            entrypoint: "main"
        })
    }
}

const app = new App({
    context: {
        provider: process.env.PROVIDER
    }
});
new ExampleStack(app, "example-stack");
```

## 3. Import a YaSF Resolver
Add at least one YaSF resolver by first installing it:
```bash
npm i @yasf-serverless/cdktf-aws-resolver
```
or for yarn:
```bash
yarn add @yasf-serverless/cdktf-aws-resolver
```
And then adding its name as a configuration item in your `package.json` to enable it:

```json
  ...
  "yasf": {
    "resolvers": [
      "@yasf-serverless/cdktf-aws-resolver"
    ]
  },
  ...
```

## 4. Use the abstraction library for your serverless functions
While this step is optional, your serverles functions cwill likely need to be deployed in a specific way. YaSF currently provides an abstraction library for Python functions. Add `yasf-python` to your dependencies and use it in your code as below:

```python
from yasf import entrypoint, GenericContext

# This decorator takes care of the whole abstraction process of both inputs and outputs 
@entrypoint
def lambda_handler(event: dict, context: GenericContext):
    # event and context are received in the same format independently of the cloud provider

    # Developer provided code
    # ...
```

## 5. Deploy!
Run the following command to deploy your application.
You can optionally append a resolver to specifically deploy against that resolver.
Otherwise, all enabled resolvers will be deployed.
```bash
npx yasf deploy
```

# Future work
Next steps for YaSF are to add more resolvers to support additonal cloud providers and to add more constructs and abstractions to allow multiple combinations and integrations. There are plans to also add support for other languages, both for Infrastructre as Code and serverless functions' abstractions. Any contribution is welcome! 