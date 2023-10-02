The goal of this repository is to give a solution for the challenge given by Fetch. The goal consists of building a webservice that fits the needs of the following API definition:

To run said project, you may need to download [Docker](https://docs.docker.com/engine/install/) if not yet installed.

If/When docker is installed run the following commands to be able to test the API using services such as [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to give examples.

`docker build -t receipt-processor .`

`docker run -p 3000:3000 receipt-processor`

```
openapi: 3.0.3
info:
    title: Receipt Processor
    description: A simple receipt processor
    version: 1.0.0
paths:
    /receipts/process:
        post:
            summary: Submits a receipt for processing
            description: Submits a receipt for processing
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/Receipt"
            responses:
                200:
                    description: Returns the ID assigned to the receipt
                    content:
                        application/json:
                            schema:
                                type: object
                                required:
                                    - id
                                properties:
                                    id:
                                        type: string
                                        pattern: "^\\S+$"
                                        example: adb6b560-0eef-42bc-9d16-df48f30e89b2

                400:
                    description: The receipt is invalid
    /receipts/{id}/points:
        get:
            summary: Returns the points awarded for the receipt
            description: Returns the points awarded for the receipt
            parameters:
                - name: id
                  in: path
                  required: true
                  description: The ID of the receipt
                  schema:
                      type: string
                      pattern: "^\\S+$"
            responses:
                200:
                    description: The number of points awarded
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    points:
                                        type: integer
                                        format: int64
                                        example: 100
                404:
                    description: No receipt found for that id

components:
    schemas:
        Receipt:
            type: object
            required:
                - retailer
                - purchaseDate
                - purchaseTime
                - items
                - total
            properties:
                retailer:
                    description: The name of the retailer or store the receipt is from.
                    type: string
                    pattern: "^\\S+$"
                    example: "Target"
                purchaseDate:
                    description: The date of the purchase printed on the receipt.
                    type: string
                    format: date
                    example: "2022-01-01"
                purchaseTime:
                    description: The time of the purchase printed on the receipt. 24-hour time expected.
                    type: string
                    format: time
                    example: "13:01"
                items:
                    type: array
                    minItems: 1
                    items:
                        $ref: "#/components/schemas/Item"
                total:
                    description: The total amount paid on the receipt.
                    type: string
                    pattern: "^\\d+\\.\\d{2}$"
                    example: "6.49"

        Item:
            type: object
            required:
                - shortDescription
                - price
            properties:
                shortDescription:
                    description: The Short Product Description for the item.
                    type: string
                    pattern: "^[\\w\\s\\-]+$"
                    example: "Mountain Dew 12PK"
                price:
                    description: The total price payed for this item.
                    type: string
                    pattern: "^\\d+\\.\\d{2}$"
                    example: "6.49"
```