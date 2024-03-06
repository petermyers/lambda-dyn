# LambdaDyn
A dynamic DNS solution running on AWS Lambda and Route53.

### Requirements
- Node >= 20 installed and active.
- A Linux server (tested on Ubuntu) that you want to run this from.

A build script is provided to build an OSX client, however, no installation scripts are provided like with Linux.

### Setup Cloud Infrastructure
Ensure you are authenticated with AWS.  
https://www.serverless.com/framework/docs/providers/aws/guide/credentials  
  
Provision a public hosted zone in Route53.  
https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html
  
Create a `.env` file with the following contents:

```
HOSTED_ZONE_ID=id-of-your-hosted-zone
```  
  
Install via Serverless:
```
npm install
npm run dp:dev
```
This will deploy all the infrastructure including the API gateway and lambda functions.

### Setup Client
Currently supports Linux (tested on Ubuntu). Since I don't yet publish prebuilt binaries, you'll have to build this on the host Linux machine. Ensure at least Node 20 is installed and active, and you have this repository cloned. Then:
```
npm install
./build-linux.sh
```
This will build a zip file with built binaries as well as some install and uninstall scripts.

```
cd ~
cp LambdaDyn/.pkg/lambdadyn-client.zip
unzip lambdadyn-client.zip -d client

cd client
./install.sh
```

Install script will create a `sytsemctl` service, install the binary to the `/bin` directory, ensure `/var/log/lambdadyn` is present, and copy a sample config to `/etc/lambdadyn/config.json`

Grab the API GW invocation url as well as the API Key that was created as part of the Serverless deploy.

Update the `/etc/lambdadyn/config.json` file:
```
{
  "dynServerUrl": "your-apigw-url",
  "apiKey": "your-api-key",
  "logsDir": "/var/log/lambdadyn",
  "hosts": [
    "your-hosts-you-want-updated, e.g. app.test.com"
  ]
}
```

Start the service:
```
sudo systemctl start lambdadyn.service
```

### Uninstalling Client
#### Stopping the service
```
sudo systemctl stop lambdadyn.service
```
#### Uninstall completely
The zipped package contains an uninstall script that will remove lambdadyn entirely.

### Logging
Client logs can be found at `/var/log/lambdadyn`. They're rotated daily.

### Infrastructure Cleanup
To cleanup created Cloudformation resources, run:
```
npm run dy:dev
```

Note, this will leave behind hosted zone records, you will have to clean those up by hand.