// src/components/Canvas.js
import React from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';

const Canvas = ({ items, setItems }) => {
  const canvasRef = React.useRef(null);

  const [, drop] = useDrop(() => ({
    accept: ['image', 'text'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        if (item.type === 'text') {
          setItems((prevItems) => [
            ...prevItems,
            {
              id: Date.now(),
              type: 'text',
              x: offset.x,
              y: offset.y,
              width: 150,
              height: 50,
              text: 'Editable Text',
            },
          ]);
        } else if (item.type === 'image') {
          setItems((prevItems) => [
            ...prevItems,
            {
              id: Date.now(),
              type: 'image',
              x: offset.x,
              y: offset.y,
              width: 200,
              height: 150,
              src: 'https://via.placeholder.com/200x150',
              isImageUploaded: false,
            },
          ]);
        }
      }
    },
  }));

  const combinedRef = (node) => {
    drop(node);
    canvasRef.current = node;
  };

  const updateItemPositionAndSize = (id, x, y, width, height) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, x, y, width, height } : item
      )
    );
  };

  const handleDrag = (id, e) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (
      clientX < canvasBounds.left ||
      clientX > canvasBounds.right ||
      clientY < canvasBounds.top ||
      clientY > canvasBounds.bottom
    ) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  const handleTextChange = (id, newText) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? {
                    ...item,
                    src: reader.result,
                    width: img.width,
                    height: img.height,
                    isImageUploaded: true,
                  }
                : item
            )
          );
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div
        ref={combinedRef}
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          border: '2px dashed gray',
          minHeight: '600px',
          minWidth: '800px',
          padding: '20px',
        }}
      >
        {items.map((item) => (
          <Rnd
            key={item.id}
            size={{ width: item.width, height: item.height }}
            position={{ x: item.x, y: item.y }}
            onDragStop={(e, d) => {
              updateItemPositionAndSize(item.id, d.x, d.y, item.width, item.height);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateItemPositionAndSize(
                item.id,
                position.x,
                position.y,
                ref.offsetWidth,
                ref.offsetHeight
              );
            }}
            onDrag={(e) => handleDrag(item.id, e)}
            style={{
              border: '1px solid black',
              backgroundColor: '#f9f9f9',
              padding: '5px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.type === 'text' && (
              <textarea
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {item.type === 'image' && (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {!item.isImageUploaded && (
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(item.id, e)}
                    style={{
                      position: 'absolute',
                      top: 5,
                      left: 5,
                      zIndex: 10,
                      backgroundColor: 'white',
                      padding: '5px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  />
                )}
                {item.isImageUploaded && (
                  <img
                    src={item.src}
                    alt="uploaded"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>
            )}
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
