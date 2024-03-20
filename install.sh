#!/bin/bash

source venv/bin/activate
pip install -r requirements.txt
cp config/nginx.conf /etc/nginx
nginx -s reload
nginx -t
