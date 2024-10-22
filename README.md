# LORA TRAIN DATASET PREPERATION

## Pre Requisites

At least 100 Images for training inside `dataset/original_images` folder


## Steps

1- Copy `.env.example` file to `.env` file
2- Make sure sh files have permission to execute

```sh
chmod +x *.sh
```

3- Execute `./setup.sh`
4- Execute `./augmentation.sh`
5- Execute `./captioning.sh`
