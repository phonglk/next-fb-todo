import classNames from 'classnames';
import _ from 'lodash';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';
import AddBtn from './AddBtn';
import LoadableContainer from './LoadableContainer';
import Spinner from './Spinner';
import { TodoItemObject } from './TodoItem';

const genId = () => `${new Date().getTime()}_${_.uniqueId()}`;

export default function Input(props: {
  addTodo: (todo: TodoItemObject) => Promise<void>;
}) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isLoading) return;
    setInputValue(event.target.value);
    setError('');
  };

  const onInputKeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.keyCode !== 13) return;

    onAddClick();
  };

  const onAddClick = async () => {
    if (isLoading) return;
    const title = inputValue.trim();

    if (!title) {
      setError('You must enter your todo item');
      inputRef.current.focus();
      return;
    }
    if (title.length > 50) {
      setError(`Your todo should not exceed 50 chars (${title.length})`);
      inputRef.current.focus();
      return;
    }

    const newTodo = {
      title,
      checked: false,
      id: genId(),
    };
    setIsLoading(true);
    await props.addTodo(newTodo);
    setIsLoading(false);
    setInputValue('');
    inputRef.current.focus();
  };
  return (
    <LoadableContainer className="flex flex-grow-0 my-4" isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onInputKeydown}
          className={classNames(
            'w-full px-4 py-3 font-thin rounded shadow',
            error && 'border-red-500',
            isLoading && 'bg-gray-300'
          )}
          ref={inputRef}
        />
        <span className="block h-3 mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
          {error}
        </span>
      </div>
      <AddBtn onClick={onAddClick} />
    </LoadableContainer>
  );
}
