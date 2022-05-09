import { useLinks } from './canvas-meta';
import { useGraphLinkOptions } from './graph';

const Link = ({ tree }) => {
  const links = useLinks(tree);
  const { component: Component } = useGraphLinkOptions();
  return (
    <svg className="mind-graph-link" width={300} height={200}>
      {links.map(item => (
        <Component key={item._id} item={item} />
      ))}
    </svg>
  );
};

export default Link;
