#!/bin/bash

source venv/bin/activate
pip install -r requirements.txt
sudo cp config/nginx.conf /etc/nginx
sudo nginx -s reload
sudo nginx -t
