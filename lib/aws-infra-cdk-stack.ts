import {CfnOutput, Stack, StackProps, Tags} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket, BucketEncryption} from "aws-cdk-lib/aws-s3";
import {Networking} from "./networking";
import {DocumentManagementAPI} from "./api";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import path from "path";

export class AwsInfraCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'DocumentsBucket', {
            encryption: BucketEncryption.S3_MANAGED
        });

        new BucketDeployment(this, 'DocumentsDeployment', {
            sources: [
                Source.asset(path.join(__dirname, '..', 'documents'))
            ],
            destinationBucket: bucket,
            memoryLimit: 512
        })

        new CfnOutput(this, "DocumentsBucketNameExport", {
            value: bucket.bucketName,
            exportName: "DocumentsBucketName"
        });

        const networkingStack = new Networking(this, "NetworkingConstruct", {
            maxAzs: 2
        });

        Tags.of(networkingStack).add("Module", "Networking");

        const api = new DocumentManagementAPI(this, 'DocumentManagementAPI', {
            documentBucket: bucket
        })

        Tags.of(api).add("Module", "API");
    }
}
