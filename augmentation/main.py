import cv2
import os
import albumentations as A
import random
import string
from pathlib import Path

# Function to load images from a directory
def load_images_from_folder(folder):
    images = []
    for filename in os.listdir(folder):
        img = cv2.imread(os.path.join(folder, filename))
        if img is not None:
            images.append((img, filename))  # Store both the image and its filename
    return images

# Function to generate a random prefix
def generate_random_prefix(length=5):
    letters = string.ascii_lowercase  # or use string.ascii_letters for both cases
    return ''.join(random.choice(letters) for _ in range(length))

# Define your augmentation pipeline
def create_augmentation_pipeline():
    return [
        ("original", None),  # Original image (no augmentation)
        ("flip_horizontal", A.HorizontalFlip(p=1.0)),
        ("flip_vertical", A.VerticalFlip(p=1.0)),
        ("rotate_90", A.Rotate(limit=90, p=1.0)),
        ("rotate_180", A.Rotate(limit=180, p=1.0)),
        ("random_crop", A.RandomCrop(width=430, height=430, p=1.0)),
        ("random_brightness_contrast", A.RandomBrightnessContrast(p=1.0)),
        ("color_jitter", A.HueSaturationValue(hue_shift_limit=20, sat_shift_limit=20, val_shift_limit=20, p=1.0)),
        ("gauss_noise", A.GaussNoise(var_limit=(10.0, 50.0), p=0.5)),
        ("elastic_transform", A.ElasticTransform(alpha=1.0, sigma=50.0, p=0.5)),
        ("optical_distortion", A.OpticalDistortion(distort_limit=0.3, p=0.5)),
        ("grid_distortion", A.GridDistortion(num_steps=5, distort_limit=0.3, p=0.5)),
        ("hue_shift", A.HueSaturationValue(hue_shift_limit=10, p=0.5)),
        ("gaussian_blur", A.GaussianBlur(blur_limit=(3, 7), p=0.5)),
        ("sharpness", A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=0, p=0.5)),
        ("cutout", A.CoarseDropout(max_holes=8, max_height=20, max_width=20, p=0.5)),
        ("channel_shuffle", A.ChannelShuffle(p=0.5)),
        ("brightness_contrast", A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5)),
        ("image_compression", A.ImageCompression(quality_lower=85, quality_upper=95, p=0.5)),
        ("random_rotate", A.Rotate(limit=(-30, 30), p=0.5)),
        ("tile", A.PadIfNeeded(min_height=450, min_width=450, border_mode=0, value=0, p=0.5)),
    ]

# Function to apply augmentations and save images
def apply_and_save_augmentations(images, augmentations, save_folder):
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)
        
    for img, filename in images:
        for name, augmentation in augmentations:
            # Generate a random prefix
            prefix = generate_random_prefix(5)  # Change the number for longer or shorter prefixes
            
            if augmentation:  # Only apply augmentations that exist
                # Apply augmentation
                try:
                    augmented = augmentation(image=img)['image']
                except Exception as e:
                    print(f"Error applying {name} to {filename}: {e}")
                    continue
            else:  # For original, just use the image
                augmented = img
            
            # Save the augmented image with a random prefix in the filename
            new_filename = f'{prefix}_{name}_{filename}'
            cv2.imwrite(os.path.join(save_folder, new_filename), augmented)

# Main function
def main():
    # Load images from a folder
    current_directory = Path.cwd()

    source_dir = current_directory / "dataset" / "original_images"
    images = load_images_from_folder(source_dir)
    
    # Create augmentation pipeline
    augmentations = create_augmentation_pipeline()
    
    # Save augmented images
    save_folder = current_directory / "dataset" / "images"
    apply_and_save_augmentations(images, augmentations, save_folder)

# Run the script
if __name__ == "__main__":
    main()
