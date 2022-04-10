import classNames from 'classnames';
import React from 'react';

export type TodoItemObject = {
  id: string;
  title: string;
  checked: boolean;
};

export default function TodoItem(props: {
  todo: TodoItemObject;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { todo, onToggle, onDelete } = props;
  return (
    <li className="flex items-center pr-2 my-2 font-light bg-white border-2 rounded hover:border-blue-300">
      <label className="flex items-center w-full h-full py-2 pl-2">
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
      <button
        onClick={onDelete}
        className="relative flex-shrink-0 p-2 my-2 bg-red-500 rounded group before:absolute before:inset-0 before:bg-red-700 before:scale-x-0 before:origin-right before:transition before:duration-300 hover:before:scale-x-100 hover:before:origin-left"
      >
        <span className="relative text-base text-white">Remove</span>
      </button>
    </li>
  );
}
