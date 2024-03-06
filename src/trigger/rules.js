import { updateRoute53RecordSet } from "../flavors/update-route53-record-set";
import { toChangeResourceRecordSetRequest } from "../models/dns-record";

export default [
  {
    id: 'UpdateDnsRecord',
    flavor: updateRoute53RecordSet,
    toChangeResourceRecordSetRequest,
    eventType: /dns-record-(created|updated)/,
  }
];