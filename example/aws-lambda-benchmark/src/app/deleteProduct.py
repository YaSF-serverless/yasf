from services import ProductService as service
from yasf import entrypoint, GenericContext

productService = service.ProductService()


@entrypoint
def handler(event: dict, _context: GenericContext):

    sku = event['path']

    result = productService.deleteItem(sku)

    print(result)

    return {
        "statusCode": 200,
        "body": ""
    }
