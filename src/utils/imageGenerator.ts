
export async function generateImageForTask(title: string): Promise<string | null> {
  try {
    // Clean and prepare the search term
    const searchTerm = title.toLowerCase()
      .replace(/\b(create|add|make|do|complete|finish)\b/g, '')
      .trim();

    // Construct the Unsplash URL with search term
    const baseUrl = 'https://source.unsplash.com/featured/512x256/?';
    const query = encodeURIComponent(searchTerm);
    
    // Add a random parameter to prevent caching
    const random = Math.random();
    const imageUrl = `${baseUrl}${query}&random=${random}`;

    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}
