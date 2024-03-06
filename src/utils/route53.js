import Connector from '../connectors/route53';
import _ from 'highland';
import { rejectWithFault } from 'aws-lambda-stream/utils/faults';
import { debug as d } from 'aws-lambda-stream/utils/print';

export const changeResourceRecordSet = ({
  debug = d('r53'),
  requestField = 'resourceRecordSetChangeRequest',
  responseField = 'resourceRecordSetChangeResponse',
  parallel = Number(process.env.R53_PARALLEL) || Number(process.env.PARALLEL) || 8,
} = {}) => {
  const connector = new Connector({ debug });

  const put = (uow) => {
    const putPromise = connector.changeResourceRecordSet(uow[requestField])
      .then((response) => ({ ...uow, [responseField]: response }))
      .catch(rejectWithFault(uow));

    return _(putPromise);
  };

  return (s) => s
    .map(put)
    .parallel(parallel);
}