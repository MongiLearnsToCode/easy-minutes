import React from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    Heading1, Heading2, Heading3, Pilcrow,
    ListOrdered, List, Undo, Redo
} from 'lucide-react';

interface RichTextToolbarProps {
    editorRef: React.RefObject<HTMLDivElement>;
}

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; tooltip: string }> = ({ onClick, children, tooltip }) => (
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
        onClick={onClick}
        className="p-2 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors relative group"
        aria-label={tooltip}
    >
        {children}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {tooltip}
        </span>
    </button>
);

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editorRef }) => {
    const handleCommand = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand(command, false, value);
        }
    };

    return (
        <div className="bg-slate-100 border-b border-slate-200 rounded-t-lg p-1.5 flex flex-wrap items-center gap-1">
            <ToolbarButton onClick={() => handleCommand('undo')} tooltip="Undo">
                <Undo className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('redo')} tooltip="Redo">
                <Redo className="w-5 h-5" />
            </ToolbarButton>
            <div className="w-px h-5 bg-slate-300 mx-1"></div>
            <ToolbarButton onClick={() => handleCommand('formatBlock', '<h1>')} tooltip="Heading 1">
                <Heading1 className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('formatBlock', '<h2>')} tooltip="Heading 2">
                <Heading2 className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('formatBlock', '<h3>')} tooltip="Heading 3">
                <Heading3 className="w-5 h-5" />
            </ToolbarButton>
             <ToolbarButton onClick={() => handleCommand('formatBlock', '<p>')} tooltip="Paragraph">
                <Pilcrow className="w-5 h-5" />
            </ToolbarButton>
            <div className="w-px h-5 bg-slate-300 mx-1"></div>
            <ToolbarButton onClick={() => handleCommand('bold')} tooltip="Bold">
                <Bold className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('italic')} tooltip="Italic">
                <Italic className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('underline')} tooltip="Underline">
                <Underline className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('strikeThrough')} tooltip="Strikethrough">
                <Strikethrough className="w-5 h-5" />
            </ToolbarButton>
            <div className="w-px h-5 bg-slate-300 mx-1"></div>
            <ToolbarButton onClick={() => handleCommand('insertUnorderedList')} tooltip="Bulleted List">
                <List className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => handleCommand('insertOrderedList')} tooltip="Numbered List">
                <ListOrdered className="w-5 h-5" />
            </ToolbarButton>
        </div>
    );
};

export default RichTextToolbar;