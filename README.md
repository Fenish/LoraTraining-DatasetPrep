# LORA TRAIN DATASET PREPERATION

## Pre Requisites

At least 100 Images for training inside `dataset/original_images` folder


## Steps

- Copy `.env.example` file to `.env` file
- Make sure sh files have permission to execute

```sh
chmod +x *.sh
```

- Execute `./setup.sh`
- Execute `./augmentation.sh`
- Execute `./captioning.sh`
