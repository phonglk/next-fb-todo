import React from 'react';
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

  const todos = todosDoc?.data() ?? [];

  const addTodo = async (todo: TodoItemObject) => {
    const newTodos = todos.concat(todo);
    await setDoc(userDoc, newTodos);
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
      <Input addTodo={addTodo} />
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleFor(todo.id)}
            onDelete={deleteFor(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Todo;
