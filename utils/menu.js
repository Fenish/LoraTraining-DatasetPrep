import readline from "readline";
import { captionImages, renameImages } from "./fileOps.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function mainMenu() {
    console.clear();
    console.log("Select an option:");
    console.log("1. Rename Files");
    console.log("2. Caption Files");
    console.log("3. Exit");
    rl.question("Enter a choice: ", async (input) => {
        switch (input) {
            case "1":
                console.log("Rename Files");
                await renameImages();
                break;
            case "2":
                console.log("\nPlease enter a image style. (Paisley, Leopard, etc.)");
                const promptType = await selectCaptionType();
                await captionImages(promptType);
                break;
            case "3":
                rl.close();
                return;
            default:
                console.log("Invalid choice");
                return mainMenu();
        }
    });
}

async function selectCaptionType() {
    return new Promise((resolve) => {
        rl.question("Prompt type: ", (type) => {
            resolve(type);
        });
    });
}