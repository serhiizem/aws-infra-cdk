import {Construct} from "constructs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import path from "path";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class DocumentManagementAPI extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        new NodejsFunction(this, 'MyGetDocumentsFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'getDocuments',
            entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts')
        });
    }
}