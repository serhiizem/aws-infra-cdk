import {Construct} from "constructs";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import path from "path";

export class DocumentManagementAPI extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        new Function(this, 'MyGetDocumentsFunction', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'getDocuments',
            code: Code.fromAsset(path.join(__dirname, '..', 'api', 'getDocuments'))
        });
    }
}