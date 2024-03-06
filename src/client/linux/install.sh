echo "Installing LambdaDyn service."

# Construct config
echo "Installing configuration..."
cat > config.json <<- EOM
{
  "dynServerUrl": "your-server-url",
  "apiKey": "your-api-key",
  "logsDir": "/var/log/lambdadyn",
  "hosts": [
    "example.app.your.domain"
  ]
}
EOM
sudo mkdir -p /etc/lambdadyn
sudo mv config.json /etc/lambdadyn/

# Ensure log directory exists
sudo mkdir -p /var/log/lambdadyn

# Move executable
sudo cp ./bin/lambdadyn /bin/lambdadyn

# Create service unit
cat > lambdadyn.service <<- EOM
[Unit]
Description=LambdaDyn dynamic DNS client.
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
ExecStart=/bin/lambdadyn --config /etc/lambdadyn/config.json
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=%n
EOM

sudo mv lambdadyn.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable lambdadyn.service

echo "Installation finished!"
echo "To finish setting up your client, fill out your config.json file located at /etc/lambdadyn/config.json."
echo "Then, start the service with sudo systemctl start lambdadyn.service."
echo -e "\n\nGood luck out there.\n\n"