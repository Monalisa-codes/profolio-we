import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Section = ({ id, data, onDelete, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners}>
            <GripVertical className="text-gray-400 cursor-grab" />
          </button>
          <select 
            className="border rounded px-2 py-1"
            value={data.type}
            onChange={(e) => onUpdate(id, { ...data, type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="gallery">Gallery</option>
            <option value="skills">Skills</option>
          </select>
        </div>
        <button 
          onClick={() => onDelete(id)} 
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {data.type === 'text' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Section Title"
            className="w-full p-2 border rounded"
            value={data.title || ''}
            onChange={(e) => onUpdate(id, { ...data, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            className="w-full p-2 border rounded h-32"
            value={data.content || ''}
            onChange={(e) => onUpdate(id, { ...data, content: e.target.value })}
          />
        </div>
      )}

      {data.type === 'image' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id={`image-upload-${id}`}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdate(id, { ...data, url: event.target.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label 
              htmlFor={`image-upload-${id}`}
              className="cursor-pointer text-blue-500 hover:text-blue-600"
            >
              Click to upload image or drag and drop
            </label>
          </div>
          {data.url && (
            <img 
              src={data.url} 
              alt="Section" 
              className="max-h-48 mx-auto"
            />
          )}
          <input
            type="text"
            placeholder="Caption"
            className="w-full p-2 border rounded"
            value={data.caption || ''}
            onChange={(e) => onUpdate(id, { ...data, caption: e.target.value })}
          />
        </div>
      )}

      {data.type === 'skills' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Skills (comma-separated)"
            className="w-full p-2 border rounded"
            value={data.skills?.join(', ') || ''}
            onChange={(e) => onUpdate(id, { 
              ...data, 
              skills: e.target.value.split(',').map(skill => skill.trim()) 
            })}
          />
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;