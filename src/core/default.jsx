import { linkHorizontal } from 'd3-shape';
import { memo, useMemo } from 'react';

export const DefaultNodeComponent = memo(({ _id }) => {
  return (
    <div className="px-4 py-2 h-12 w-24 bg-white truncate text-base leading-none font-bold font-serif antialiased text-gray-800 border border-green-400 shadow rounded-sm">
      Node: <span className="text-xl leading-none text-center text-green-500 font-bold">{_id}</span>
    </div>
  );
});

export const DefaultLinkComponent = memo(({ item, ...rest }) => {
  const d = useMemo(() => linkHorizontal()(item), [item]);
  return (
    <g>
      <path d={d} className="fill-transparent stroke-current text-gray-600 stroke-2 hover:text-primary" {...rest} />
    </g>
  );
});

const defaultBgSize = 40;
const defaultBgColor = '#FAFAFA';
export const DefaultBackground = memo(({ size = defaultBgSize, color = defaultBgColor }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" className="absolute -z-99">
      <defs>
        <pattern
          id="doodad"
          width={size}
          height={size}
          viewBox="0 0 40 40"
          patternUnits="userSpaceOnUse"
          patternTransform=""
        >
          <rect width="100%" height="100%" fill="transparent" />
          <path d="M-0.5 20v20h1v-20zM39.5 20v20h1v-20z" fill={color} />
          <path d="M-10 29.5 h60 v1 h-60z" fill={color} />
          <path d="M19.5 0v40h1v-40z" fill={color} />
          <path d="M-10 9.5h60v1h-60z" fill={color} />
          <path d="M-0.5 0v20h1v-20zM39.5 0v20h1v-20z" fill={color} />
        </pattern>
      </defs>
      <rect fill="url(#doodad)" height="100%" width="100%" />
    </svg>
  );
});
