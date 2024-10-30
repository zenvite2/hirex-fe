// components/RichTextEditor/index.tsx
import React from 'react';
import { 
  Bold, 
  Italic, 
  Link2, 
  Image, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  className = '' 
}) => {
  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className={`border rounded-lg border-gray-300 overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <select 
          className="h-8 px-2 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => executeCommand('formatBlock', e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        
        <button 
          onClick={() => executeCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bold"
          type="button"
        >
          <Bold size={16} />
        </button>
        <button 
          onClick={() => executeCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Italic"
          type="button"
        >
          <Italic size={16} />
        </button>
        <button 
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) executeCommand('createLink', url);
          }}
          className="p-2 hover:bg-gray-200 rounded"
          title="Insert Link"
          type="button"
        >
          <Link2 size={16} />
        </button>
        <button 
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) executeCommand('insertImage', url);
          }}
          className="p-2 hover:bg-gray-200 rounded"
          title="Insert Image"
          type="button"
        >
          <Image size={16} />
        </button>
        <button 
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Numbered List"
          type="button"
        >
          <List size={16} />
        </button>
        <button 
          onClick={() => executeCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Align Left"
          type="button"
        >
          <AlignLeft size={16} />
        </button>
        <button 
          onClick={() => executeCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Align Center"
          type="button"
        >
          <AlignCenter size={16} />
        </button>
        <button 
          onClick={() => executeCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Align Right"
          type="button"
        >
          <AlignRight size={16} />
        </button>
      </div>
      <div
        className="p-4 min-h-[200px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        style={{ outline: 'none' }}
      />
    </div>
  );
};

export default RichTextEditor;