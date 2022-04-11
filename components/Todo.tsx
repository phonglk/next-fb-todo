import React, { useEffect, useRef, useState } from 'react';
import firebase, { firestore } from '../firebase/clientApp';
import { User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import TodoItem, { TodoItemObject } from './TodoItem';
import _ from 'lodash';
import Input from './Input';

type Props = {
  authUser: User;
};

const TODO_LIMIT = 20;

const todoItemConverter: FirestoreDataConverter<TodoItemObject[]> = {
  toFirestore(todoItems: WithFieldValue<TodoItemObject[]>): DocumentData {
    return { todos: JSON.stringify(todoItems) };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TodoItemObject[] {
    const data = snapshot.data(options);
    try {
      return JSON.parse(data.todos);
    } catch (e) {
      return [];
    }
  },
};

function Todo({ authUser }: Props) {
  const userDoc = doc(firestore, 'todos', authUser.email).withConverter(
    todoItemConverter
  );
  const [todosDoc, todosLoading, todosError] = useDocument(userDoc);
  const [pendingList, setPendingList] = useState([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const todos = todosDoc?.data() ?? [];
  const uiTodos = todos.map((todo) => ({
    ...todo,
    isActionPending: pendingList.includes(todo.id),
  }));

  const setPending = (id: string) => setPendingList((list) => list.concat(id));

  const unsetPending = (id: string) =>
    setPendingList((list) => list.filter((todo) => todo !== id));

  const scrollToBottom = () => {
    const $container = scrollContainerRef.current;
    if (!$container) return;
    const listHeight = $container.children[0].clientHeight;
    $container.scrollTo(0, listHeight);
  };

  const addTodo = async (todo: TodoItemObject) => {
    if (todos.length >= TODO_LIMIT) {
      alert(`You cannot create more than ${TODO_LIMIT} todos`);
      return;
    }
    const newTodos = todos.concat(todo);
    setPending(todo.id);
    scrollToBottom();
    await setDoc(userDoc, newTodos);
    unsetPending(todo.id);
  };

  const toggleFor = (id: string) => async () => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    setPending(id);
    await setDoc(userDoc, newTodos);
    unsetPending(id);
  };

  const deleteFor = (id: string) => async () => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setPending(id);
    await setDoc(userDoc, newTodos);
  };

  const removeCompletedTodos = async () => {
    const completed = todos.filter((todo) => todo.checked);
    if (!completed.length) {
      alert('Nothing to remove!');
      return;
    }
    if (!confirm(`Do you want to remove ${completed.length} todos`)) return;

    const newTodos = todos.filter((todo) => !todo.checked);
    setPendingList((list) => list.concat(completed.map((todo) => todo.id)));
    await setDoc(userDoc, newTodos);
  };

  return (
    <div className="flex flex-col flex-grow">
      {todosError && <strong>Error: {JSON.stringify(todosError)}</strong>}
      {todosLoading && <span>Collection: Loading...</span>}
      <Input addTodo={addTodo} />
      <div className="flex flex-grow-0">
        <button
          className="p-2 my-2 mr-1 bg-blue-300 rounded"
          onClick={removeCompletedTodos}
        >
          Remove all completed task
        </button>
      </div>
      <div
        className="flex flex-col flex-grow overflow-auto basis-0"
        ref={scrollContainerRef}
      >
        <ul className="">
          {uiTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleFor(todo.id)}
              onDelete={deleteFor(todo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
