import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket, BucketEncryption} from "aws-cdk-lib/aws-s3";
import {Networking} from "./networking";

export class AwsInfraCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'DocumentsBucket', {
            encryption: BucketEncryption.S3_MANAGED
        });

        new CfnOutput(this, "DocumentsBucketNameExport", {
            value: bucket.bucketName,
            exportName: "DocumentsBucketName"
        })

        new Networking(this, "NetworkingConstruct", {
            maxAzs: 2
        })
    }
}
