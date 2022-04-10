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
      {isLoading && (
        <div className="absolute z-10 flex items-center content-center w-full h-full bg-white opacity-75">
          <Spinner className="flex flex-grow w-full" />
        </div>
      )}
      {children}
    </div>
  );
}
