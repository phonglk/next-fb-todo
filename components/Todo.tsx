import React, { useEffect, useState } from 'react';
import firebase from '../firebase/clientApp';
import { User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import TodoItem, { TodoItemObject } from './TodoItem';
import _ from 'lodash';
import Input from './Input';

const firestore = getFirestore(firebase);

type Props = {
  authUser: User;
};

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

  const todos = todosDoc?.data() ?? [];
  const uiTodos = todos.map((todo) => ({
    ...todo,
    isActionPending: pendingList.includes(todo.id),
  }));

  const setPending = (id: string) => setPendingList((list) => list.concat(id));

  const unsetPending = (id: string) =>
    setPendingList((list) => list.filter((todo) => todo !== id));

  const addTodo = async (todo: TodoItemObject) => {
    const newTodos = todos.concat(todo);
    setPending(todo.id);
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

  return (
    <div className="flex flex-col flex-grow">
      {todosError && <strong>Error: {JSON.stringify(todosError)}</strong>}
      {todosLoading && <span>Collection: Loading...</span>}
      <Input addTodo={addTodo} />
      <div className="flex flex-col flex-grow overflow-auto basis-0">
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
