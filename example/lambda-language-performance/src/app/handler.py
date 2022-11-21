import random

from yasf import entrypoint, GenericContext


@entrypoint
def hello(event: dict, _context: GenericContext):
    number = 1000

    if event["arguments"]['arraySize'] != "":
        number = int(event["arguments"]['arraySize'])

    array = random.sample(range(number), number)

    array = sorted(array)

    # print(array)

    # body = {
    #     "message": array,
    #     "input": event
    # }

    response = {
        "statusCode": 200,
        "body": array
    }

    return response
