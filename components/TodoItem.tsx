import classNames from 'classnames';
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import LoadableContainer from './LoadableContainer';
import Spinner from './Spinner';

export type TodoItemObject = {
  id: string;
  title: string;
  checked: boolean;
};

export type TodoItemUIObject = TodoItemObject & {
  isActionPending?: boolean; // To mark item with pending action such as adding | deleting | updating
};

export default function TodoItem(props: {
  todo: TodoItemUIObject;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { todo, onToggle, onDelete } = props;

  const [isNoteVisible, setIsNotVisible] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNoteVisible) {
      noteRef.current.focus();
    }
  }, [isNoteVisible]);

  const confirmDelete = () => {
    if (!confirm('Are you sure you want to delete this todo ?')) return;
    onDelete();
  };

  const closeNote = () => {
    setIsNotVisible(false);
  };

  const onNoteEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      closeNote();
    }
  };

  return (
    <li className="flex w-full">
      <LoadableContainer
        isLoading={todo.isActionPending}
        className="flex my-2 grow"
      >
        <div
          className={classNames(
            'flex items-center pr-2 font-light bg-white border-2 rounded hover:border-blue-300 grow',
            todo.isActionPending && 'bg-gray-200'
          )}
        >
          <label className="flex items-center w-full h-full py-2 pl-2 grow">
            <input
              id={todo.id}
              type="checkbox"
              onChange={onToggle}
              required
              checked={todo.checked}
              className="mr-2"
            />
            <span
              className={classNames(
                todo.checked ? 'line-through text-gray-700' : '',
                'text-xl'
              )}
            >
              {todo.title}
            </span>
          </label>
          <div className="relative flex-shrink-0 ">
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
              <textarea
                ref={noteRef}
                className="w-full h-full"
                onKeyDown={onNoteEnter}
                value={noteContent}
                onChange={(event) => setNoteContent(event.target.value)}
              />
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
          </div>
          <button
            onClick={confirmDelete}
            className="relative flex-shrink-0 p-2 my-2 bg-red-500 rounded group before:absolute before:inset-0 before:bg-red-700 before:scale-x-0 before:origin-right before:transition before:duration-300 hover:before:scale-x-100 hover:before:origin-left"
          >
            <span className="relative text-base text-white">Remove</span>
          </button>
        </div>
      </LoadableContainer>
    </li>
  );
}
