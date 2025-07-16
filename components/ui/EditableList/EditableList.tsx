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
    // Close editing mode if we're editing the item being deleted
    if (editingIndex === index) {
      setEditingIndex(null);
      setTempText('');
    } else if (editingIndex !== null && editingIndex > index) {
      // Adjust editing index if we're editing an item after the deleted one
      setEditingIndex(editingIndex - 1);
    }
    deleteLine(section, index);
  };

  const handleUpdate = (index: number, text: string) => {
    if (text.trim()) {
      updateLine(section, index, text.trim());
    }
    setEditingIndex(null);
    setTempText('');
  };

  const handleAdd = (text: string) => {
    if (text.trim()) {
      addLine(section, text.trim());
    }
    setTempText('');
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempText('');
  };

  const handleCancelAdd = () => {
    setTempText('');
    setIsAdding(false);
  };

  return (
    <div className='flex flex-col space-y-2 w-full max-h-40'>
      {(list || []).map((line, index) => (
        <div key={`${section}-${index}-${line.substring(0, 10)}`}>
          {editingIndex === index ? (
            <div className="w-full flex flex-row text-sm items-start gap-1">
              <textarea
                className="w-full resize-none border rounded p-1"
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onBlur={() => handleUpdate(index, tempText)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdate(index, tempText);
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                autoFocus
              />
              <Button
                onClick={() => handleDelete(index)}
                variant="destructive"
                className="text-xs cursor-pointer rounded-xl p-1 min-w-6 h-6"
              >
                ×
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-row items-start gap-1">
              <div
                className="p-1 flex-1 cursor-pointer"
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
                className="text-xs cursor-pointer rounded-xl p-1 min-w-6 h-6"
              >
                ×
              </Button>
            </div>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="mt-2 flex flex-row items-start gap-1">
          <textarea
            className="w-full resize-none border rounded p-1"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={() => handleAdd(tempText)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd(tempText);
              } else if (e.key === 'Escape') {
                handleCancelAdd();
              }
            }}
            autoFocus
          />
          <Button
            onClick={handleCancelAdd}
            variant="destructive"
            className="text-xs cursor-pointer rounded-xl p-1 ml-1 min-w-6 h-6"
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
            +
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableList;