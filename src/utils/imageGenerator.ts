
import axios from 'axios';
import { supabase } from '@/lib/supabase';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

async function translateIfNeeded(title: string): Promise<{ original: string; translated: string }> {
  try {
    // More robust check for non-English text
    const nonEnglishPattern = /[^\x00-\x7F]/; // Matches any non-ASCII character
    const containsNonEnglish = nonEnglishPattern.test(title);
    
    if (!containsNonEnglish) {
      console.log('Text appears to be English:', title);
      return { original: title, translated: title };
    }

    console.log('Attempting to translate:', title);
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: { text: title }
    });

    if (error) {
      console.error('Translation error:', error);
      throw error;
    }

    console.log('Translation result:', data);
    return { 
      original: title,
      translated: data.translatedText || title
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { original: title, translated: title };
  }
}

export async function generateImageForTask(title: string, todoId?: string): Promise<string | null> {
  try {
    if (!title) return null;

    // First translate the title if needed
    const { original, translated } = await translateIfNeeded(title);
    console.log('Translation complete:', { original, translated });

    // Clean and prepare the search term
    const searchTerm = translated.toLowerCase()
      .replace(/\b(create|add|make|do|complete|finish)\b/g, '')
      .trim();

    if (!searchTerm) return null;

    console.log('Searching Unsplash with term:', searchTerm);

    // Check if we already have an image for this exact title
    const { data: existingTodo } = await supabase
      .from('todos')
      .select('image_url')
      .eq('title', original)
      .not('image_url', 'is', null)
      .single();

    if (existingTodo?.image_url) {
      console.log('Using existing image for:', original);
      return existingTodo.image_url;
    }

    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        },
        params: {
          query: searchTerm,
          orientation: 'landscape'
        }
      });

      if (response.data && response.data.urls && response.data.urls.small) {
        const imageUrl = response.data.urls.small;
        console.log('Generated new image URL:', imageUrl);

        if (todoId) {
          const { error: updateError } = await supabase
            .from('todos')
            .update({ image_url: imageUrl })
            .eq('id', todoId);

          if (updateError) {
            console.error('Error updating image URL:', updateError);
          }
        }

        return imageUrl;
      }
    } catch (error) {
      console.error('Error with Unsplash API:', error);
    }

    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}
