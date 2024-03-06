const IP_HEADER = 'x-forwarded-for';

export const createDnsRecord = (req, res) => {
  const ip = req.headers[IP_HEADER];
  const body = {
    ...req.body,
    ip
  };
  return req.namespace.models.dnsRecord
    .update(body)
    .then((entity) => res.status(200).json(entity))
    .catch((err) => res.status(400).json({ error: err }));
};