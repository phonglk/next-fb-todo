import classNames from 'classnames';
import _ from 'lodash';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';
import AddBtn from './AddBtn';
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
    if (!inputValue.trim()) {
      setError('You must enter your todo item');
      inputRef.current.focus();
      return;
    }
    const title = inputValue;
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
    <div className="flex my-4">
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
      {isLoading && <Spinner className="ml-3 w-11 h-11" />}
      <AddBtn onClick={onAddClick} />
    </div>
  );
}
