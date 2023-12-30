import {Construct} from "constructs";
import {IpAddresses, IVpc, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";

interface NetworkingProps {
    maxAzs: number;
}

export class Networking extends Construct {

    public readonly vpc: IVpc;

    constructor(scope: Construct, id: string, props: NetworkingProps) {
        super(scope, id);

        this.vpc = new Vpc(this, 'AppVPC', {
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    name: 'Public',
                    cidrMask: 24,
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                }
            ],
        });

    }
}
