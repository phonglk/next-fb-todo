import classNames from 'classnames';
import { doc, setDoc } from 'firebase/firestore';
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase/clientApp';
import LoadableContainer from './LoadableContainer';
import { TodoItemUIObject } from './TodoItem';

export default function NoteBtn({ todo }: { todo: TodoItemUIObject }) {
  const [isNoteVisible, setIsNotVisible] = useState(false);

  const closeNote = () => {
    setIsNotVisible(false);
  };

  return (
    <>
      <button
        className="p-2 my-2 mr-1 bg-yellow-500 rounded"
        onClick={() => setIsNotVisible(!isNoteVisible)}
      >
        <span className="relative text-base text-white">Notes</span>
      </button>
      <div
        className={classNames(
          'transition-opacity absolute w-[200px] z-20 mr-2 bg-gray-600 border-gray-500 h-36 top-2 right-full',
          isNoteVisible ? 'opacity-100' : 'opacity-0 invisible'
        )}
      >
        {isNoteVisible && <NoteInput closeNote={closeNote} id={todo.id} />}
      </div>
      <div
        className={classNames(
          'transition-opacity fixed top-0 left-0 z-10 w-full h-full bg-white',
          isNoteVisible
            ? 'opacity-50 pointer-events-auto'
            : 'opacity-0 pointer-events-none invisible'
        )}
        onClick={closeNote}
      />
    </>
  );
}

function NoteInput(props: { closeNote: () => void; id: string }) {
  const noteDoc = doc(firestore, 'notes', props.id);
  const [note, noteLoading, noteError] = useDocument(noteDoc);

  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNoteContent((note?.data() ?? {}).content ?? '');
  }, [note]);

  useEffect(() => {
    if (noteLoading) return;
    noteRef.current.focus();
  }, [noteLoading]);

  const noteRef = useRef<HTMLTextAreaElement>(null);

  const closeNote = async () => {
    const updatedNote = { content: noteContent };
    await setDoc(noteDoc, updatedNote);
    props.closeNote();
  };

  const onNoteEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      closeNote();
    }
  };

  return (
    <LoadableContainer
      isLoading={noteLoading || isLoading}
      className="w-full h-full"
    >
      <textarea
        ref={noteRef}
        className="w-full h-full"
        onKeyDown={onNoteEnter}
        value={noteContent}
        onChange={(event) => setNoteContent(event.target.value)}
        placeholder="No note yet. Shift + Enter to break line."
      />
    </LoadableContainer>
  );
}
