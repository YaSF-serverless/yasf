from services import ProductService as service

from yasf import entrypoint, GenericContext

productService = service.ProductService()

@entrypoint
def handler(event: dict, _context: GenericContext):

    body = event['body']
    sku = body.get('sku', '')
    name = body.get('name', '')
    description = body.get('description', '')

    result = productService.createItem(sku, name, description)

    return {
        "statusCode": 200,
        "body": result
    }
    
