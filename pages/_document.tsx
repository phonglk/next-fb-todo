import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="h-full">
      <Head />
      <body className="flex items-center justify-center h-full bg-gradient-to-bl from-violet-900 to-teal-400">
        <div className="flex flex-col flex-grow w-full h-full m-10 max-w-screen-lg">
          <h2 className="flex-grow-0 my-5 text-2xl font-bold text-center text-slate-100 md:text-4xl">
            Todo List
          </h2>
          <div className="flex flex-col flex-grow p-8 mb-6 bg-gray-100 rounded-xl drop-shadow-2xl">
            <Main />
          </div>
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
