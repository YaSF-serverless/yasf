from services import ProductService as service
from yasf import entrypoint, GenericContext


productService = service.ProductService()


@entrypoint
def handler(event: dict, _context: GenericContext):

    sku = event['path']

    item = productService.getItem(sku)

    return {
        "statusCode": 200,
        "body": item
    }
