import os
import datetime

from yasf.nosqldb import client


class ProductService:
    def __init__(self):
        self.table_name = os.environ['PRODUCTS_TABLE']

    def getItem(self, sku):
        return client.get_item(
            table_name=self.table_name,
            key_name='sku',
            key_value=sku
        )

    def createItem(self, sku, name, description):
        timestamp = datetime.datetime.utcnow().isoformat()

        item = {
            'sku': sku,
            'name': name,
            'description': description,
            'createdAt': timestamp,
            'updatedAt': timestamp
        }

        client.put_item(
            table_name=self.table_name,
            key=sku,
            item=item
        )
        return item

    def deleteItem(self, sku):
        return client.delete_item(
            table_name=self.table_name,
            key_name='sku',
            key_value=sku
        )

    def updateItem(self, sku, name, description):
        # return self.dynamoDBClient.update_item(
        #     Key={'sku': sku},
        #     ExpressionAttributeNames={
        #         '#name': 'name',
        #         '#description': 'description'
        #     },
        #     ExpressionAttributeValues={
        #         ':n': name,
        #         ':d': description
        #     },
        #     UpdateExpression="set #name = :n, #description = :d",
        #     ReturnValues="UPDATED_NEW"
        # )
        return client.update_item(
            table_name=self.table_name,
            key_name='sku',
            key_value=sku,
            item={
                'name': name,
                'description': description
            }
        )

    def listItems(self):
        return client.list_items(self.table_name)
