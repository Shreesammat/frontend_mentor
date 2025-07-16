import { useState } from 'react';
import ListItem from './listItem';
import { useCreateJournalStore } from '@/Zustand/tradeStore';
import { Button } from '../button';

type SectionArrayKeys = 'emotions' | 'psychology' | 'learnings';

const EditableList = ({ section }: { section: SectionArrayKeys }) => {
  const list = useCreateJournalStore((state) => state[section]);
  const updateLine = useCreateJournalStore((state) => state.updateLine);
  const addLine = useCreateJournalStore((state) => state.addLine);
  const deleteLine = useCreateJournalStore((state) => state.deleteLine);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (index: number) => {
    // If we're editing the item being deleted, exit edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
      setTempText('');
    } 
    // If we're editing an item after the one being deleted, adjust the editing index
    else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
    deleteLine(section, index);
  };

  return (
    <div className='flex flex-col space-y-2 w-full max-h-40'>
      {(list || []).map((line, index) => (
        <div key={`${section}-${line.substring(0, 20)}-${list.length}-${index}`} className="flex flex-row items-start gap-1">
          {editingIndex === index ? (
            <>
              <textarea
                className="w-full resize-none border rounded p-1 text-sm"
                value={tempText}  
                onChange={(e) => setTempText(e.target.value)}
                onBlur={() => {
                  if(tempText.trim()) updateLine(section, index, tempText.trim());
                  setEditingIndex(null);
                  setTempText('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if(tempText.trim()) updateLine(section, index, tempText.trim());
                    setEditingIndex(null);
                    setTempText('');
                  } else if(e.key === 'Escape') {
                    setEditingIndex(null);
                    setTempText('');
                  }
                }}
                autoFocus
              />
              <Button
                onClick={() => handleDelete(index)}
                variant="destructive"
                size="sm"
                className="text-xs px-2 py-1 h-8 w-8"
              >
                ×
              </Button>
            </>
          ) : (
            <>
              <div
                className="p-1 flex-1 cursor-pointer hover:bg-gray-50 rounded"
                onClick={() => {
                  setEditingIndex(index);
                  setTempText(line);
                }}
              >
                <ListItem index={index}>{line}</ListItem>
              </div>
              <Button
                onClick={() => handleDelete(index)}
                variant="destructive"
                size="sm"
                className="text-xs px-2 py-1 h-8 w-8"
              >
                ×
              </Button>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="mt-2 flex flex-row items-start gap-1">
          <textarea
            className="w-full resize-none border rounded p-1 text-sm"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={() => {
              if (tempText.trim()) addLine(section, tempText.trim());
              setTempText('');
              setIsAdding(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (tempText.trim()) addLine(section, tempText.trim());
                setTempText('');
                setIsAdding(false);
              } else if(e.key === 'Escape') {
                setTempText('');
                setIsAdding(false);
              }
            }}
            autoFocus
          />
          <Button
            onClick={() => {
              setTempText('');
              setIsAdding(false);
            }}
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 h-8 w-8"
          >
            ×
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setTempText('');
            }}
          >
            + Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableList;