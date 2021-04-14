import React from 'react';

import BlockComponents from './BlockComponents';

declare type block = {
  data: any;
  type: any;
};

interface DisplayBlocksProps {
  blocks?: block[];
}

const mapBlockToComponent = (block: block) => {
  if (block.type === 'paragraph') {
    return 'p';
  }

  if (block.type === 'header') {
    return `h${block.data.level}`;
  }
};

const DisplayBlocks: React.FC<DisplayBlocksProps> = ({ blocks }) => {
  console.log(blocks);

  if (!!!blocks) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = mapBlockToComponent(block);
        console.log(key);
        return (
          <div key={`block_${block.type}_${index}`}>
            {BlockComponents[key](block)}
          </div>
        );
      })}
    </>
  );
};

export default DisplayBlocks;
