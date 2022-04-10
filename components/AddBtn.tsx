import React from 'react';

export default function AddBtn(props: { onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="relative h-12 px-6 mx-2 overflow-hidden bg-blue-500 border rounded group
        before:absolute
        before:inset-0
        before:bg-blue-600
        before:scale-y-[0.1]
        before:origin-bottom
        before:transition
        before:duration-300
        hover:before:scale-y-100
      "
    >
      <div
        aria-hidden="true"
        className="transition duration-300 group-hover:-translate-y-12"
      >
        <div className="flex items-center justify-center h-12">
          <span className="text-white">Add</span>
        </div>
        <div className="flex items-center justify-center h-12">
          <span className="text-white">To do!</span>
        </div>
      </div>
    </button>
  );
}
