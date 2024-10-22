import axios from "axios";
import { Ollama } from 'ollama'

const webui = process.env.WEBUI_URL;
const ollama_url = process.env.OLLAMA_URL
const webui_token = process.env.WEBUI_ACCESS_TOKEN;
const SYSTEM_PROMPT = ""
const USER_PROMPT = `
Give me a text-to-image prompt for this image, separated by commas. 
Make it simple and suitable for AI training. 
I want a long sentence formatted as keywords, not a story. 
My model needs clarity.
Separate the prompt as keywords, with a minimum of 10 and a maximum of 30 words. 
Make it ultra-detailed and Keywords must be maximum 4 words long.
Inspect every pixel of the image and generate the best result. 
Highlight intricate details of the [PATTERN_TYPE] design.
The primary style of the image is "[IMAGE_STYLE]".
Ensure accuracy and exclusivity to "[IMAGE_STYLE]" without mixing in other styles.
Provide refined output separated by commas and without quotes or prefixes.
Don't put "Create a " in front of the prompt. Just give keywords seperated by commas without quotes.
`

const ollama = new Ollama({
	host: ollama_url,
})

export async function useLLAVA(image_base64_data, promptType) {
	const replacedPrompt = USER_PROMPT.replaceAll("[IMAGE_STYLE]", promptType);
	const response = await ollama.chat({
		model: "llava:7b",
		messages: [
			{
				role: "user",
				content: replacedPrompt,
				images: [image_base64_data],
			}
		]
	})

	return response.message.content
}

async function useLLM(image_base64_data) {
	const bodyData = {
		model: "chatgpt-4o-latest",
		messages: [
			{ role: "user", 
				content: [
					{
						type: "text",
						text: USER_PROMPT,
					},
					{
						type: "image_url",
						image_url: {
							url: image_base64_data,
						}
					}
				]
			},
			{ role: "system", content: SYSTEM_PROMPT },
		],
	};

	const response = await axios.post(`${webui}/openai/chat/completions`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${webui_token}`,
		},
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch. Status: ${response.status}`);
	}

	const responseJson = await response.json();
	return responseJson.choices[0].message.content;
}

