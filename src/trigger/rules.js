import { updateRoute53RecordSet } from "../flavors/update-route53-record-set";
import { toUpdateResourceRecordSetRequest, toRemoveResourceRecordSetRequest } from "../models/dns-record";

export default [
  {
    id: 'UpdateDnsRecord',
    flavor: updateRoute53RecordSet,
    toChangeResourceRecordSetRequest: toUpdateResourceRecordSetRequest,
    eventType: /^dns-record-(created|updated)$/,
  },
  {
    id: 'RemoveDnsRecord',
    flavor: updateRoute53RecordSet,
    toChangeResourceRecordSetRequest: toRemoveResourceRecordSetRequest,
    eventType: /^dns-record-deleted$/
  }
];