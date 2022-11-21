from uuid import uuid4
from yasf import entrypoint, GenericContext, nosqldb
import os

DB_NAME = os.getenv("DB_NAME")

# This decorator takes care of the whole abstraction process of both inputs and outputs 
@entrypoint
def lambda_handler(event: dict, context: GenericContext):
    # event and context are received in the same format independent of the cloud provider

    # Developer provided code
    # ...

    body = {
        "id": str(uuid4()),
        **event
    }

    nosqldb.put_item(
        table_name=DB_NAME,
        item=body
    )

    response = {
        "statusCode": 200,
        "body": body
    }

    return response
