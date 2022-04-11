import classNames from 'classnames';
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import LoadableContainer from './LoadableContainer';
import NoteBtn from './NoteBtn';
import Spinner from './Spinner';

export type TodoItemObject = {
  id: string;
  title: string;
  checked: boolean;
  status?: 'Waiting' | 'Doing' | 'Blocked';
};

export type TodoItemUIObject = TodoItemObject & {
  isActionPending?: boolean; // To mark item with pending action such as adding | deleting | updating
};

export default function TodoItem(props: {
  todo: TodoItemUIObject;
  onDelete: () => void;
  onToggle: () => void;
  onUpdateStatus: (status: string) => Promise<void>;
}) {
  const { todo, onToggle, onDelete, onUpdateStatus } = props;
  const [status, setStatus] = useState((todo.status ?? 'Waiting') as string);

  const confirmDelete = () => {
    if (!confirm('Are you sure you want to delete this todo ?')) return;
    onDelete();
  };

  useEffect(() => {
    console.log({ status, todo });
    if (todo.status === status) return;
    onUpdateStatus(status);
  }, [onUpdateStatus, todo, status]);

  return (
    <li className="flex w-full">
      <LoadableContainer
        isLoading={todo.isActionPending}
        className="flex my-2 grow"
      >
        <div
          className={classNames(
            'transition-all duration-300 flex items-center pr-2 font-light bg-white border-2 rounded hover:border-blue-400 grow',
            todo.isActionPending && '!bg-gray-300',
            status === 'Doing' && 'bg-green-100 border-green-300',
            status === 'Blocked' && 'bg-red-100 border-red-300',
            todo.checked && '!bg-gray-200 border-gray-300'
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
            <select
              className="mr-2 rounded w-28"
              value={status}
              onChange={(event) => setStatus(event.currentTarget.value)}
            >
              {todo.checked ? (
                <option>Done</option>
              ) : (
                <>
                  <option value="Waiting">Waiting</option>
                  <option value="Doing">Doing</option>
                  <option value="Blocked">Blocked</option>
                </>
              )}
            </select>
            <NoteBtn todo={todo} />
            <button
              onClick={confirmDelete}
              className="relative flex-shrink-0 p-2 my-2 bg-red-500 rounded group before:absolute before:inset-0 before:bg-red-700 before:scale-x-0 before:origin-right before:transition before:duration-300 hover:before:scale-x-100 hover:before:origin-left"
            >
              <span className="relative text-base text-white">Remove</span>
            </button>
          </div>
        </div>
      </LoadableContainer>
    </li>
  );
}
