import { debug as d } from 'debug';
import DynamoDBConnector from 'aws-lambda-stream/connectors/dynamodb';
import apiGenerator from 'lambda-api';
import { createDnsRecord } from './routes/dns-record';
import Model from '../models/dns-record';

const api = apiGenerator();

api.use((req, res, next) => {
  res.cors();
  next();
})

api.post('/dns-record', createDnsRecord);

export const handle = async (event, context) => {
  // console.log('Event: %j', event);
  // console.log('Context: %j', context);

  const debug = d(`handler${event.path.split('/').join(':')}`);

  api.app({
    debug,
    models: {
      dnsRecord: new Model(
        debug,
        new DynamoDBConnector({
          debug,
          tableName: process.env.ENTITY_TABLE_NAME
        })
      )
    }
  });

  return api.run(event, context);
};