import { useCreation, useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';
import { useRef } from 'react';
import { useRegistAnchor } from './canvas-meta';
import { useGraphNodeOptions, useValueFocus } from './graph';

const Node = ({ node, children }) => {
  const ref = useRef();
  const option = useGraphNodeOptions();
  const { focus, onFocus } = useValueFocus();

  const { Component, defaultProps } = useCreation(() => {
    const { component: Component, props: defaultProps } = option[node?.type] || option.default;
    return { Component, defaultProps };
  }, [option]);

  useRegistAnchor(node?._id, ref);

  const onFocusItem = useMemoizedFn(evt => {
    evt.stopPropagation();
    evt.preventDefault();
    onFocus(node);
  });

  return (
    <div className="flex items-center gap-16">
      <div
        className={
          focus?._id === node._id
            ? 'cursor-pointer p-2 border-2 border-dashed rounded-md border-red-500 shadow-md'
            : 'cursor-pointer p-2 border-2 border-transparent'
        }
        ref={ref}
        onClick={onFocusItem}
      >
        <Component {...defaultProps} {...node} />
      </div>
      {children && <div className="flex flex-col justify-center gap-1">{children}</div>}
    </div>
  );
};

export default Node;

export function renderTree(nodes) {
  return nodes.map(node => {
    if (isEmpty(node.children)) {
      return <Node key={node._id} node={node} />;
    }
    return (
      <Node key={node._id} node={node}>
        {node.children.map(child => renderTree([child]))}
      </Node>
    );
  });
}
