-- Drop existing tables and types
DROP TABLE IF EXISTS todo_assignments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS todo_categories CASCADE;
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant necessary permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    completed BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    reminder TIMESTAMP WITH TIME ZONE,
    location JSONB,
    creator_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create todo_categories table
CREATE TABLE todo_categories (
    todo_id UUID REFERENCES todos ON DELETE CASCADE,
    category_id UUID REFERENCES categories ON DELETE CASCADE,
    PRIMARY KEY (todo_id, category_id)
);

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_categories ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "todos_select" ON todos;
DROP POLICY IF EXISTS "todos_insert" ON todos;
DROP POLICY IF EXISTS "todos_update" ON todos;
DROP POLICY IF EXISTS "todos_delete" ON todos;
DROP POLICY IF EXISTS "categories_select" ON todo_categories;
DROP POLICY IF EXISTS "categories_insert" ON todo_categories;
DROP POLICY IF EXISTS "categories_delete" ON todo_categories;

-- Create simplified policies for todos
CREATE POLICY "allow_select_own_todos" ON todos
    FOR SELECT TO authenticated
    USING (creator_id = auth.uid());

CREATE POLICY "allow_insert_own_todos" ON todos
    FOR INSERT TO authenticated
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "allow_update_own_todos" ON todos
    FOR UPDATE TO authenticated
    USING (creator_id = auth.uid());

CREATE POLICY "allow_delete_own_todos" ON todos
    FOR DELETE TO authenticated
    USING (creator_id = auth.uid());

-- Create simplified policies for categories
CREATE POLICY "allow_select_own_categories" ON categories
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "allow_insert_own_categories" ON categories
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "allow_update_own_categories" ON categories
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "allow_delete_own_categories" ON categories
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- Create simplified policies for todo_categories
CREATE POLICY "allow_manage_own_todo_categories" ON todo_categories
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM todos
            WHERE id = todo_id AND creator_id = auth.uid()
        )
    ); 