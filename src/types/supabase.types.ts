
export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          completed: boolean;
          image_url: string | null;
          reminder: string | null;
          location: {
            address: string;
            lat: number;
            lng: number;
          } | null;
          urgency: 'low' | 'medium' | 'high' | 'urgent';
          creator_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          created_at: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
