import { useEventListener } from 'ahooks';
import { createContext, useContext, useMemo, useRef } from 'react';
import { useInitiCanvasMeta } from './canvas-meta';
import { useGraphTree, useValueFocus } from './graph';
import { useResizeCallback, useZoom } from './hook';
import Link from './link';
import { renderTree } from './node';
import Toolbar from './toolbar';

const CanvasContext = createContext();

export const CanvasProvider = ({ options: { initialScale, maxScale, minScale } }) => {
  const containerRef = useRef();

  const { zoom, zoomText, zoomIn, zoomOut } = useZoom(initialScale, maxScale, minScale);
  const { unFocus } = useValueFocus();

  const fitCenter = useInitiCanvasMeta('m-canvas-container', 'm-canvas');

  const { tree, refresh } = useGraphTree();
  useResizeCallback(containerRef, refresh);

  useEventListener('scroll', evt => {}, { target: containerRef });

  const nodes = useMemo(() => renderTree(tree), [tree]);

  const context = useMemo(() => ({ zoom, zoomText, zoomIn, zoomOut, fitCenter }), [zoom, zoomText]);
  return (
    <CanvasContext.Provider value={context}>
      <div
        className="overflow-auto overscroll-contain w-full h-full relative"
        id="m-canvas-container"
        ref={containerRef}
      >
        <div
          className="h-2h w-2w flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
          id="m-canvas"
          onClick={unFocus}
        >
          <div className="w-max">
            {nodes}
            <Link tree={tree} />
          </div>
        </div>
      </div>
      <Toolbar />
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  return context;
};
