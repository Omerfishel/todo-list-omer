
import { supabase } from '@/lib/supabase';

export interface Todo {
  id: string;
  title: string;
  content?: string | null;
  completed: boolean;
  image_url?: string | null;
  reminder?: string | null;
  location?: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  category_ids: string[];
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'TODO_COMPLETED' | 'TODO_ASSIGNED' | 'TODO_UNASSIGNED';
}

export const todoApi = {
  getAll: async () => {
    try {
      const { data: todos, error } = await supabase
        .from('todos')
        .select(`
          *,
          todo_categories (
            category_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching todos:', error);
        return [];
      }

      if (!todos) return [];

      return todos.map(todo => ({
        ...todo,
        category_ids: todo.todo_categories?.map(tc => tc.category_id) || []
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },

  create: async (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'creator_id'>) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    // Convert Date objects to ISO strings for Supabase
    const reminderString = todo.reminder instanceof Date 
      ? todo.reminder.toISOString() 
      : todo.reminder;

    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title: todo.title,
        content: todo.content || '',
        completed: false,
        image_url: todo.image_url,
        reminder: reminderString,
        location: todo.location,
        urgency: todo.urgency || 'low',
        creator_id: userData.user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from todo creation');
    }

    if (todo.category_ids?.length > 0) {
      const categoryAssociations = todo.category_ids.map(categoryId => ({
        todo_id: data.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('todo_categories')
        .insert(categoryAssociations);

      if (categoryError) {
        console.error('Error associating categories:', categoryError);
        await supabase.from('todos').delete().eq('id', data.id);
        throw categoryError;
      }
    }

    return {
      ...data,
      category_ids: todo.category_ids || []
    };
  },

  update: async (id: string, todo: Partial<Todo>) => {
    try {
      // Convert Date objects to ISO strings for Supabase
      const reminderString = todo.reminder instanceof Date 
        ? todo.reminder.toISOString() 
        : todo.reminder;

      const { data, error } = await supabase
        .from('todos')
        .update({
          title: todo.title,
          content: todo.content,
          completed: todo.completed,
          image_url: todo.image_url,
          reminder: reminderString,
          location: todo.location,
          urgency: todo.urgency || 'low'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating todo:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from todo update');
      }

      if (todo.category_ids !== undefined) {
        const { error: deleteError } = await supabase
          .from('todo_categories')
          .delete()
          .eq('todo_id', id);

        if (deleteError) {
          console.error('Error deleting category associations:', deleteError);
          throw deleteError;
        }

        if (todo.category_ids.length > 0) {
          const categoryAssociations = todo.category_ids.map(categoryId => ({
            todo_id: id,
            category_id: categoryId
          }));

          const { error: insertError } = await supabase
            .from('todo_categories')
            .insert(categoryAssociations);

          if (insertError) {
            console.error('Error creating category associations:', insertError);
            throw insertError;
          }
        }
      }

      return {
        ...data,
        category_ids: todo.category_ids || []
      };
    } catch (error) {
      console.error('Error in update operation:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  assign: async (todoId: string, userId: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('todo_assignments')
      .insert({
        todo_id: todoId,
        user_id: userId,
        assigned_by: userData.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  unassign: async (todoId: string, userId: string) => {
    const { error } = await supabase
      .from('todo_assignments')
      .delete()
      .match({ todo_id: todoId, user_id: userId });

    if (error) throw error;
  }
};

export const categoryApi = {
  getAll: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userData.user?.id)
      .order('name');

    if (error) throw error;
    return data;
  },

  create: async (category: Omit<Category, 'id' | 'created_at' | 'user_id'>) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        color: category.color,
        user_id: userData.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, category: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        color: category.color
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const profileApi = {
  searchUsers: async (query: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(5);

    if (error) throw error;
    return data;
  },

  getNotifications: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  markNotificationAsRead: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  }
};
