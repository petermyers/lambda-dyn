import { faulty } from "aws-lambda-stream/utils/faults";
import { changeResourceRecordSet } from "../utils/route53";
import { filterOnEventType } from "aws-lambda-stream/filters/event";
import { printStartPipeline, printEndPipeline } from "aws-lambda-stream/utils/print";


export const updateRoute53RecordSet = (rule) => (stream) =>
  stream
    .filter(onEventType(rule))
    .tap(printStartPipeline)
    .map(toChangeResourceRecordSetRequest(rule))
    .through(changeResourceRecordSet(rule))
    .tap(printEndPipeline);

const onEventType = (rule) => faulty((uow) => filterOnEventType(rule, uow));

const toChangeResourceRecordSetRequest = (rule) => faulty((uow) => ({
  ...uow,
  resourceRecordSetChangeRequest: rule.toChangeResourceRecordSetRequest
    ? rule.toChangeResourceRecordSetRequest(uow)
    : undefined
}));