# SAM - API Gateway HTTP API with Cognito Authorizer

![SAM - API Gateway HTTP API with Cognito Authorizer](images/diagram.png)

# Prerequisites

* [React application with Amazon Cognito created with Amplify](https://github.com/aurbac/amplify-react-app)

# Testing the API inside your React application with Amplify

In you Amplify project replace your **src/App.js** with the following file [src/App.js](amplify/src/App.js) and **src/index.js** with the following file [src/index.js](amplify/src/index.js).

For **src/index.js** replace: `<HttpApiUrl>` and `<Region>` with your own values.

# References

* [SAM - AWS::Serverless::HttpApi](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html).
* [Working with HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
