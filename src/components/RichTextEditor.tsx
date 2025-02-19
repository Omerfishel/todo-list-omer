import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from './ui/button';
import { ImagePlus, Bold, Italic, List, ListOrdered, CheckSquare, Save, X } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  onDiscard?: () => void;
  viewMode?: 'list' | 'grid';
}

export function RichTextEditor({ content, onChange, onSave, onDiscard, viewMode = 'grid' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4 space-y-1',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
        nested: true,
        onReadOnlyChecked: (node, checked) => {
          return true;
        }
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none',
      },
      handleClick: (view, pos, event) => {
        const node = view.state.doc.nodeAt(pos);
        if (node && node.type.name === 'taskItem') {
          const checked = !node.attrs.checked;
          view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            checked,
          }));
          onChange(view.state.doc.toJSON());
          return true;
        }
        return false;
      },
    },
    editable: !viewMode || viewMode === 'grid',
  });

  const addImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor?.chain().focus().setImage({ src: e.target?.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {(!viewMode || viewMode === 'grid') && (
        <div className="flex gap-2 p-2 border-b bg-gray-50 items-center">
          <div className="flex gap-2 flex-1">
            <Button
              type="button" // Prevent form submission
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
              className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
              className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleTaskList().run();
              }}
              className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImage}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
          </div>
          {viewMode === 'list' && onSave && onDiscard && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onDiscard();
                }}
                className="text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onSave();
                }}
                className="text-green-500 hover:bg-green-50"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
      <style>
        {`
          .ProseMirror {
            padding: 1rem;
            min-height: 100px;
            outline: none;
          }

          .ProseMirror ul[data-type="taskList"] {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .ProseMirror ul[data-type="taskList"] li {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            margin: 0.5rem 0;
          }

          .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div {
            text-decoration: line-through;
            color: #6b7280;
          }

          .ProseMirror p {
            margin: 0;
          }
        `}
      </style>
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  );
}
