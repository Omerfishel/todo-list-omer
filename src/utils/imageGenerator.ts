
export async function generateImageForTask(title: string): Promise<string | null> {
  const API_KEY = localStorage.getItem('RUNWARE_API_KEY');
  if (!API_KEY) return null;

  try {
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: API_KEY
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: `high quality minimalist illustration related to: ${title}`,
          model: "runware:100@1",
          width: 512,
          height: 256,
          numberResults: 1,
          outputFormat: "WEBP"
        }
      ])
    });

    const data = await response.json();
    const imageData = data.data.find((item: any) => item.taskType === 'imageInference');
    return imageData?.imageURL || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}
