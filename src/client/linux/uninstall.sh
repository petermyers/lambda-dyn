sudo systemctl stop lambdadyn.service
sudo systemctl disable lambdadyn.service

sudo rm /etc/systemd/system/lambdadyn.service
sudo rm -rf /etc/lambdadyn
sudo rm -rf /var/log/lambdadyn
sudo rm /bin/lambdadyn

sudo systemctl daemon-reload