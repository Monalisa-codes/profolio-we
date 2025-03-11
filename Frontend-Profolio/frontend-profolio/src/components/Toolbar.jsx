// src/components/Toolbar.js
import React from 'react';
import { useDrag } from 'react-dnd';

const Toolbar = () => {
  const DraggableItem = ({ type, label }) => {
    const [, drag] = useDrag(() => ({
      type,
      item: { type },
    }));

    return (
      <div
        ref={drag}
        style={{
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid black',
          cursor: 'move',
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div style={{ width: '20%', background: '#f0f0f0', padding: '10px' }}>
      <h3>Toolbar</h3>
      <DraggableItem type="text" label="Text Box" />
      <DraggableItem type="image" label="Image Box" />
      {/* Add additional draggable items if needed */}
    </div>
  );
};

export default Toolbar;
