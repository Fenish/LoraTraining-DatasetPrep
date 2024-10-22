#!/bin/bash

mkdir -p dataset/original_images
mkdir -p dataset/images
mkdir -p dataset/captions

cd augmentation
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt