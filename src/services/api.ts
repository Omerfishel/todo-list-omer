import { supabase } from '@/lib/supabase';

export interface Todo {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
  image_url?: string;
  reminder?: Date;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  category_ids: string[];
  creator_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: Date;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: Date;
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

    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title: todo.title,
        content: todo.content,
        completed: todo.completed || false,
        image_url: todo.image_url,
        reminder: todo.reminder,
        location: todo.location,
        urgency: todo.urgency,
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
    const updates: any = {};
    if (todo.title !== undefined) updates.title = todo.title;
    if (todo.content !== undefined) updates.content = todo.content;
    if (todo.completed !== undefined) updates.completed = todo.completed;
    if (todo.image_url !== undefined) updates.image_url = todo.image_url;
    if (todo.reminder !== undefined) updates.reminder = todo.reminder;
    if (todo.location !== undefined) updates.location = todo.location;
    if (todo.urgency !== undefined) updates.urgency = todo.urgency;

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
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

        const { error: categoryError } = await supabase
          .from('todo_categories')
          .insert(categoryAssociations);

        if (categoryError) {
          console.error('Error creating category associations:', categoryError);
          throw categoryError;
        }
      }
    }

    return {
      ...data,
      category_ids: todo.category_ids || []
    };
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
      .insert([{
        todo_id: todoId,
        user_id: userId,
        assigned_by: userData.user.id
      }])
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
      .eq('user_id', userData.user.id)
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
        user_id: userData.user.id
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
