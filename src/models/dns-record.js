import { updateExpression, timestampCondition } from 'aws-lambda-stream/sinks/dynamodb';
import { defaultDebugLogger } from 'aws-lambda-stream/utils/log';
import { ttl, now } from 'aws-lambda-stream/utils/time';

export const DISCRIMINATOR = 'dns-record';

class Model {
  constructor(
    debug,
    connector
  ) {
    this.debug = defaultDebugLogger(debug);
    this.connector = connector;
  }

  update({ host, ip }) {
    if(!host || !ip) return Promise.reject("Missing host or ip.");
    const timestamp = now();

    const params = {
      Key: {
        pk: host,
        sk: DISCRIMINATOR,
      },
      ...updateExpression({
        discriminator: DISCRIMINATOR,
        host,
        ip,
        timestamp,
        ttl: ttl(timestamp, 7)
      }),
      ...timestampCondition(),
    };

    return this.connector.update(params)
      .tap(this.debug)
      .tapCatch(this.debug)
      .then((_) => ({ response: true }));
  }
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/route-53/command/ChangeResourceRecordSetsCommand/
export const toUpdateResourceRecordSetRequest = (uow) => {
  const { host, ip } = uow.event.raw.new;
  const { host: oldHost = null, ip: oldIp = null } = uow.event.raw.old || {};

  if(host === oldHost && ip === oldIp) return undefined;

  return {
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Type: "A",
            TTL: 60,
            Name: host,
            ResourceRecords: [
              { Value: ip }
            ]
          }
        }
      ],
      Comment: `Updated by lambda-dyn at ${new Date().toLocaleDateString()}`
    }
  };
};

export const toRemoveResourceRecordSetRequest = (uow) => {
  const { host, ip } = uow.event.raw.old;

  if(!host || !ip) return undefined;

  return {
    ChangeBatch: {
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Type: "A",
            TTL: 60,
            Name: host,
            ResourceRecords: [
              { Value: ip }
            ]
          }
        }
      ],
      Comment: `Updated by lambda-dyn at ${new Date().toLocaleDateString()}`
    }
  };
};

export default Model;
