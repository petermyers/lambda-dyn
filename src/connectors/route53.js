import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import Promise from 'bluebird';
import { defaultDebugLogger } from 'aws-lambda-stream/utils/log';

class Connector {
  constructor({
    debug,
    hostedZoneId = process.env.HOSTED_ZONE_ID || '',
    timeout = Number(process.env.R53_TIMEOUT) || Number(process.env.TIMEOUT) || 1000
  }) {
    this.debug = (msg) => debug('%j', msg);
    this.hostedZoneId = hostedZoneId;
    this.client = new Route53Client({
      requestHandler: new NodeHttpHandler({
        requestTimeout: timeout,
        connectionTimeout: timeout
      }),
      logger: defaultDebugLogger(debug)
    });
  }

  changeResourceRecordSet(commandParams) {
    const params = {
      HostedZoneId: this.hostedZoneId,
      ...commandParams
    };
    const command = new ChangeResourceRecordSetsCommand(params);
    return Promise.resolve(this.client.send(command))
      .tap(this.debug)
      .tapCatch(this.debug);
  }
}

export default Connector;