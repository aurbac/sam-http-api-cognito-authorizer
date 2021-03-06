import json
import boto3
from botocore.exceptions import ClientError
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import os

patch_all()

def handler(event, context):
    print(json.dumps(event))
    myres = {
            "statusCode": 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                },
            "body": "",
        }
    body = json.loads(event['body'])
    MESSAGES_TABLE = os.environ['MESSAGES_TABLE']
    dynamodb = boto3.client("dynamodb")
    try:
        response = dynamodb.update_item(
            TableName=MESSAGES_TABLE,
            Key={
                'message': {
                    'S': body['message']
                }
            },
            AttributeUpdates={
                'count': {
                    'Value': { 'N': '1' },
                    'Action': 'ADD'
                }
            },
            ReturnValues='ALL_NEW'
        )
        print(response)
        if 'Attributes' in response:
            myres['statusCode'] = 200
            myres['body'] = json.dumps( { 'message': body['message'] + ' (' + response['Attributes']['count']['N'] + ')' })
            print(myres)
            return myres
        else:
            myres['statusCode'] = 500
            myres['body'] = json.dumps({ "message": "Error." })
            print(myres)
            return myres
    except ClientError as e:
        print(e)
        myres['statusCode'] = 500
        myres['body'] = json.dumps({ "message": "Error." })
        print(myres)
        return myres