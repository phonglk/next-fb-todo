import React, { ChangeEvent, ComponentType, useRef, useState } from 'react';
import firebase from '../firebase/clientApp';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import AddBtn from './AddBtn';

const firestore = getFirestore(firebase);

type Props = {
  authUser: User;
};

type TodoItem = {
  id: string;
  title: string;
  checked: boolean;
};

const todoItemConverter: FirestoreDataConverter<TodoItem[]> = {
  toFirestore(todoItems: WithFieldValue<TodoItem[]>): DocumentData {
    return { todos: JSON.stringify(todoItems) };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TodoItem[] {
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

  const inputRef = useRef<HTMLInputElement>(null);

  const todos = todosDoc?.data() ?? [];

  const onAddClick = async () => {
    const title = inputRef.current.value.trim();
    const newTodos = todos.concat({
      title,
      checked: false,
      id: new Date().getTime() + title,
    });
    await setDoc(userDoc, newTodos);
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  const toggleFor = (id: string) => async () => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    await setDoc(userDoc, newTodos);
  };

  const deleteFor = (id: string) => async () => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    await setDoc(userDoc, newTodos);
  };

  return (
    <div>
      {todosError && <strong>Error: {JSON.stringify(todosError)}</strong>}
      {todosLoading && <span>Collection: Loading...</span>}
      <input
        type="text"
        ref={inputRef}
        className="w-1/2 px-4 py-3 my-4 font-thin rounded shadow"
      />
      <AddBtn onClick={onAddClick} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                onChange={toggleFor(todo.id)}
                checked={todo.checked}
              />{' '}
              {todo.title} <button onClick={deleteFor(todo.id)}>x</button>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
