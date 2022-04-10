import _ from 'lodash';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';
import AddBtn from './AddBtn';
import { TodoItemObject } from './TodoItem';

const genId = () => `${new Date().getTime()}_${_.uniqueId()}`;

export default function Input(props: {
  addTodo: (todo: TodoItemObject) => Promise<void>;
}) {
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value);
  };

  const onInputKeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.keyCode !== 13) return;

    onAddClick();
  };

  const onAddClick = async () => {
    const title = inputValue;
    const newTodo = {
      title,
      checked: false,
      id: genId(),
    };
    await props.addTodo(newTodo);
    setInputValue('');
    inputRef.current.focus();
  };
  return (
    <div className="flex items-center">
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onInputKeydown}
        className="w-full px-4 py-3 my-4 font-thin rounded shadow"
        ref={inputRef}
      />
      <AddBtn onClick={onAddClick} />
    </div>
  );
}
