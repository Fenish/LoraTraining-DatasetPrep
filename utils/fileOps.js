import { mainMenu } from "./menu.js";
import path from "path";
import fs from "fs/promises";
import { useLLAVA } from "./llm.js";

const image_dir = path.join(process.cwd(), "/dataset/images");
const captions_dir = path.join(process.cwd(), "/dataset/captions");

export async function renameImages() {
    console.clear();

    try {
        const files = await fs.readdir(image_dir);
        const pngFiles = files.filter(file => path.extname(file) === '.png');
        for (let i = 0; i < pngFiles.length; i++) {
            const oldPath = path.join(image_dir, pngFiles[i]);
            const newPath = path.join(image_dir, `${i + 1}.png`);
            try {
                await fs.access(newPath);
                console.log(`File ${i + 1}.png already exists, skipping...`);
                continue;
            } catch (err) {
                await fs.rename(oldPath, newPath);
                console.log(`${pngFiles[i]} renamed to ${i + 1}.png`);
            }
        }

        console.log("Renaming Done.");
    } catch (error) {
        console.error("Error renaming images:", error);
    }

    setTimeout(() => {
        mainMenu();        
    }, 1000);
}

async function generatePrompt(pngFile, base64_data, promptType) {
    console.log("Generating prompt for: " + pngFile);
    const prompt = await useLLAVA(base64_data, promptType);
    await fs.writeFile(path.join(captions_dir, pngFile.replace('.png', '.txt')), prompt);
}

export async function captionImages(promptType) {
    console.clear();
    try {
        const files = await fs.readdir(image_dir);
        const pngFiles = files.filter(file => path.extname(file) === '.png');

        // Create an array of promises for processing images
        const tasks = pngFiles.map(async (pngFile) => {
            const fullPath = path.join(image_dir, pngFile);  // Get full path
            const fileBuffer = await fs.readFile(fullPath);
            const base64_data = fileBuffer.toString('base64');

            // Call the generatePrompt function
            return generatePrompt(pngFile, base64_data, promptType);
        });

        // Wait for all tasks to complete
        await Promise.all(tasks);
        console.log("Captioning Done.");
    } catch (error) {
        console.error("Error captioning images:", error);
    }
}