import { initialize, initializeFrom } from 'aws-lambda-stream/pipelines';
import { defaultOptions } from 'aws-lambda-stream/utils/opt';
import { decryptEvent } from 'aws-lambda-stream/utils/encryption';
import { fromDynamodb } from 'aws-lambda-stream/from/dynamodb';
import { toPromise } from 'aws-lambda-stream/utils/handler';
import RULES from './rules';

const OPTIONS = { ...defaultOptions };
const PIPELINES = {
  ...initializeFrom(RULES)
};
const { debug } = OPTIONS;

export class Handler {
  constructor(options = OPTIONS) {
    this.options = options;
  }

  handle(event, includeErrors = true) {
    return initialize(PIPELINES, this.options)
      .assemble(fromDynamodb(event)
        .through(decryptEvent({
          ...this.options,
        })),
      includeErrors);
  }
}

export const handle = async (event, context, int = {}) => {
  debug('event: %j', event);
  debug('context: %j', context);

  return new Handler({ ...OPTIONS, ...int })
    .handle(event, true)
    .through(toPromise);
};