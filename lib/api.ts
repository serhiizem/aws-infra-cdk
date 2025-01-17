import {Construct} from "constructs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import path from "path";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {IBucket} from "aws-cdk-lib/aws-s3/lib/bucket";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";
import {AddRoutesOptions, CorsHttpMethod, HttpApi, HttpMethod} from "aws-cdk-lib/aws-apigatewayv2";
import {CfnOutput, Duration} from "aws-cdk-lib";
import {HttpLambdaIntegration} from "aws-cdk-lib/aws-apigatewayv2-integrations";

interface DocumentManagementAPIProps {
    documentBucket: IBucket
}

export class DocumentManagementAPI extends Construct {

    constructor(scope: Construct, id: string, props: DocumentManagementAPIProps) {
        super(scope, id);

        const getDocumentsFunction = new NodejsFunction(this, 'MyGetDocumentsFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'getDocuments',
            entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
            environment: {
                DOCUMENTS_BUCKET_NAME: props.documentBucket.bucketName
            }
        });

        const bucketPermissions = new PolicyStatement();
        bucketPermissions.addResources(`${props.documentBucket.bucketArn}/*`);
        bucketPermissions.addActions('s3:GetObject', 's3:PutObject');
        getDocumentsFunction.addToRolePolicy(bucketPermissions);

        const bucketContainerPermissions = new PolicyStatement();
        bucketContainerPermissions.addResources(`${props.documentBucket.bucketArn}`);
        bucketContainerPermissions.addActions('s3:ListBucket');
        getDocumentsFunction.addToRolePolicy(bucketContainerPermissions);

        const httpApi = new HttpApi(this, 'HttpAPI', {
            apiName: 'document-management-api',
            createDefaultStage: true,
            corsPreflight: {
                allowMethods: [CorsHttpMethod.GET],
                allowOrigins: ['*'],
                maxAge: Duration.days(10)
            }
        });

        const routeOptions: AddRoutesOptions = {
            path: '/getDocuments',
            methods: [HttpMethod.GET],
            integration: new HttpLambdaIntegration('lambda-integration', getDocumentsFunction)
        };

        httpApi.addRoutes(routeOptions);

        new CfnOutput(this, 'APIEndpoint', {
            value: httpApi.url!,
            exportName: 'APIEndpoint'
        });
    }
}