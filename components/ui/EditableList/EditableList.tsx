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

  return (
    <div className='flex flex-col space-y-2 w-full max-h-40'>
      {(list || []).map((line, index) => (
        <div key={`${section}-${line}-${index}`}>
          {editingIndex === index ? (
            <div className="w-full flex flex-row text-sm items-start">
              <textarea
                className="w-full resize-none border rounded p-1"
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
                  } else if(e.key == 'Escape') {
                    setEditingIndex(null);
                    setTempText('');
                  }
                }}
                autoFocus
              />
              <Button
                onClick={() => {
                  setEditingIndex(null);
                  setTempText('');
                  deleteLine(section, index);
                }}
                variant="destructive"
                className="text-xs cursor-pointer rounded-xl p-1"
              >
                -
              </Button>
            </div>
          ) : (
            <div
              className="p-1"
              onClick={() => {
                setEditingIndex(index);
                setTempText(line);
              }}
            >
              <ListItem index={index}>{line}</ListItem>
            </div>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="mt-2 flex flex-row items-start">
          <textarea
            className="w-full resize-none border rounded p-1"
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
              }
            }}
            autoFocus
          />
          <Button
            onClick={() => {
              setTempText('');
              setIsAdding(false);
            }}
            variant="destructive"
            className="text-xs cursor-pointer rounded-xl p-1 ml-1"
          >
            -
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
              console.log(list)
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