import { categoryApi } from '@/services/api';

const defaultCategories = [
  { name: 'Personal', color: '#E5DEFF' },
  { name: 'Work', color: '#FDE1D3' },
  { name: 'Shopping', color: '#D3E4FD' },
  { name: 'Health', color: '#FFE5E5' },
];

export async function setupDefaultCategories() {
  try {
    // First check if we have any categories
    const existingCategories = await categoryApi.getAll();
    
    if (existingCategories.length === 0) {
      // Create default categories in sequence to avoid race conditions
      for (const category of defaultCategories) {
        try {
          await categoryApi.create(category);
        } catch (error) {
          console.error(`Error creating category ${category.name}:`, error);
        }
      }
      
      console.log('Default categories created successfully!');
      return true; // Return true if categories were created
    }
    return false; // Return false if categories already existed
  } catch (error) {
    console.error('Error setting up default categories:', error);
    return false;
  }
} 