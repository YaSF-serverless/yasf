from services import ProductService as service
from yasf import entrypoint, GenericContext

productService = service.ProductService()


@entrypoint
def handler(_event: dict, _context: GenericContext):

    items = productService.listItems()

    return {
        "statusCode": 200,
        "body": items
    }
