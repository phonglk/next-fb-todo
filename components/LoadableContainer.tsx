import classNames from 'classnames';
import React, { ReactNode } from 'react';
import Spinner from './Spinner';

export default function LoadableContainer(props: {
  isLoading: boolean;
  className?: string;
  spinnerClassName?: string;
  children: ReactNode;
}) {
  const { isLoading, className, spinnerClassName, children } = props;
  return (
    <div className={classNames('relative', className)}>
      <div
        className={classNames(
          'absolute z-10 flex items-center content-center w-full h-full bg-white transition-opacity',
          isLoading
            ? 'opacity-75 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        )}
      >
        {isLoading && <Spinner className="flex flex-grow w-full" />}
      </div>
      {children}
    </div>
  );
}
