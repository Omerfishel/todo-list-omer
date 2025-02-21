import axios from 'axios';
import { supabase } from '@/lib/supabase';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

interface PexelsResponse {
  photos: Array<{
    src: {
      small: string;
      medium: string;
    };
    alt: string;
  }>;
}

async function translateIfNeeded(title: string): Promise<{ original: string; translated: string }> {
  try {
    // Check if the text is already English using a simple heuristic
    const isEnglish = /^[A-Za-z0-9\s.,!?-]*$/.test(title);
    if (isEnglish) return { original: title, translated: title };

    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: { text: title }
    });

    if (error) throw error;
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

    // Clean and prepare the search term
    const searchTerm = translated.toLowerCase()
      .replace(/\b(create|add|make|do|complete|finish)\b/g, '')
      .trim();

    if (!searchTerm) return null;

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

async function generateCategoryBasedImage(searchTerm: string): Promise<string | null> {
  // Define categories with specific search terms for better image results
  const categories = {
    health: {
      keywords: ['doctor', 'dentist', 'medical', 'health', 'hospital', 'appointment'],
      searchTerm: 'healthcare'
    },
    sports: {
      keywords: ['basketball', 'football', 'soccer', 'sport', 'gym', 'workout', 'exercise'],
      searchTerm: (term: string) => {
        if (term.includes('basketball')) return 'basketball';
        if (term.includes('football')) return 'football';
        if (term.includes('gym') || term.includes('workout')) return 'fitness';
        return 'sports';
      }
    },
    education: {
      keywords: ['study', 'homework', 'school', 'learn', 'book', 'read'],
      searchTerm: 'education'
    },
    shopping: {
      keywords: ['shop', 'buy', 'store', 'mall', 'purchase'],
      searchTerm: 'shopping'
    },
    work: {
      keywords: ['meeting', 'office', 'work', 'business', 'presentation'],
      searchTerm: 'office'
    },
    food: {
      keywords: ['eat', 'cook', 'food', 'meal', 'restaurant'],
      searchTerm: 'food'
    },
    travel: {
      keywords: ['trip', 'travel', 'vacation', 'flight', 'hotel'],
      searchTerm: 'travel'
    },
    home: {
      keywords: ['clean', 'house', 'home', 'repair', 'fix'],
      searchTerm: 'home'
    }
  };

  // Find matching category
  for (const [category, config] of Object.entries(categories)) {
    if (config.keywords.some(keyword => searchTerm.includes(keyword))) {
      const searchQuery = typeof config.searchTerm === 'function' 
        ? config.searchTerm(searchTerm)
        : config.searchTerm;
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      return `https://source.unsplash.com/random/300x200?${searchQuery}&t=${timestamp}`;
    }
  }

  return null;
}

function generateFallbackImage(title: string): string {
  console.log('Falling back to DiceBear for:', title);
  const style = 'shapes';
  const searchTerm = title.toLowerCase()
    .replace(/\b(create|add|make|do|complete|finish)\b/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();

  if (!searchTerm) return '';

  const fallbackUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(searchTerm)}&size=200&backgroundColor=ffffff`;
  console.log('Generated fallback URL:', fallbackUrl);
  return fallbackUrl;
}
