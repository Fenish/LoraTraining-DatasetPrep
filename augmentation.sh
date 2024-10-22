#!/bin/bash

echo "Augmentation in progress..."
source ./augmentation/venv/bin/activate
python ./augmentation/main.py
echo "Augmentation finished."