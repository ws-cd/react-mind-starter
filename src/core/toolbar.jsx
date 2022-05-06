import React from 'react';
import { useCanvas } from './canvas-context';

const Action = ({ children, ...rest }) => (
  <div className="p-2 rounded cursor-pointer hover:text-primary flex justify-center items-center" {...rest}>
    {children}
  </div>
);
const Divider = () => (
  <svg
    className="fill-current text-gray-300"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
  >
    <path d="M486.4 102.4h51.2v819.2h-51.2V102.4z" />
  </svg>
);
const textLength = { width: 38 };

const Toolbar = () => {
  const { zoomText, zoomIn, zoomOut, fitCenter } = useCanvas();
  return (
    <div className="absolute bottom-2 left-2 p-1 bg-white rounded shadow-md border-t border-gray-100 flex items-center gap-1">
      <Action onClick={fitCenter}>
        <svg
          t="1651207653756"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
        >
          <path d="M661.333333 554.666667H554.666667v106.666666a21.333333 21.333333 0 0 1-21.333334 21.333334h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333334V554.666667H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334H469.333333V362.666667a21.333333 21.333333 0 0 1 21.333334-21.333334h42.666666a21.333333 21.333333 0 0 1 21.333334 21.333334V469.333333h106.666666a21.333333 21.333333 0 0 1 21.333334 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334z m-512-170.666667h42.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V213.333333h149.333334a21.333333 21.333333 0 0 0 21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 0-21.333333-21.333333H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v149.333334a21.333333 21.333333 0 0 0 21.333333 21.333333z m213.333334 426.666667H213.333333v-149.333334a21.333333 21.333333 0 0 0-21.333333-21.333333h-42.666667a21.333333 21.333333 0 0 0-21.333333 21.333333V810.666667a85.333333 85.333333 0 0 0 85.333333 85.333333h149.333334a21.333333 21.333333 0 0 0 21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 0-21.333333-21.333333zM810.666667 128h-149.333334a21.333333 21.333333 0 0 0-21.333333 21.333333v42.666667a21.333333 21.333333 0 0 0 21.333333 21.333333H810.666667v149.333334a21.333333 21.333333 0 0 0 21.333333 21.333333h42.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z m64 512h-42.666667a21.333333 21.333333 0 0 0-21.333333 21.333333V810.666667h-149.333334a21.333333 21.333333 0 0 0-21.333333 21.333333v42.666667a21.333333 21.333333 0 0 0 21.333333 21.333333H810.666667a85.333333 85.333333 0 0 0 85.333333-85.333333v-149.333334a21.333333 21.333333 0 0 0-21.333333-21.333333z" />
        </svg>
      </Action>
      <Divider />
      <div className="flex gap-2 items-center">
        <Action onClick={zoomIn}>
          <svg
            className="text-base fill-current"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path
              d="M480.256 128l0 768 62.464 0 1.024-768-63.488 0zM896 480.256l-768 0 0 62.464 768 1.024 0-63.488z"
              fill=""
            />
          </svg>
        </Action>
        <span className="text-gray-700 text-sm text-center leading-none select-none" style={textLength}>
          {zoomText}
        </span>
        <Action onClick={zoomOut}>
          <svg
            className="text-base fill-current"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path d="M144 567c-24.3 0-44-19.7-44-44s19.7-44 44-44h736.127c24.3 0 44 19.7 44 44s-19.7 44-44 44H144z" />
          </svg>
        </Action>
      </div>
    </div>
  );
};

export default Toolbar;
