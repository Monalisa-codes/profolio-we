// 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { Plus, Save, Layout, User, Mail, Palette } from 'lucide-react';
import { CSS } from "@dnd-kit/utilities";
import Section from './Section';

const PortfolioCreator = () => {
  const [sections, setSections] = useState([]);
  const [portfolio, setPortfolio] = useState({
    title: '',
    subtitle: '',
    theme: 'light',
    author: '',
    contact: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
        try {
            const portfolioId = localStorage.getItem("portfolioId"); // Get stored portfolio ID
            if (!portfolioId) {
                console.error("No portfolio ID found!");
                return;
            }

            const response = await axios.get(`http://localhost:5000/portfolio/${portfolioId}/edit`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const { settings, sections } = response.data;
            setPortfolio(settings);
            setSections(sections);
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }
    };
    fetchPortfolio();
}, []);

  

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

//   const addSection = () => {
//     const newSection = { 
//         id: `section-${Date.now()}`, 
//         type: 'text', 
//         title: '', 
//         content: '' 
//     };
    
//     setSections(prevSections => [...prevSections, newSection]);
// };


  const updateSection = (id, newData) => {
    setSections(sections.map(section => (section.id === id ? { ...section, ...newData } : section)));
  };

  const deleteSection = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(section => section.id !== id));
    }
  };

  const addSection = () => {
    const newSection = { 
      id: `section-${Date.now()}`, 
      type: 'text', 
      title: '', 
      content: '' 
    };
    
    setSections(prevSections => [...prevSections, newSection]);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) return; // Ensure drag target exists
    
    if (active.id !== over.id) {
      setSections(prevSections => {
        const oldIndex = prevSections.findIndex(section => section.id === active.id);
        const newIndex = prevSections.findIndex(section => section.id === over.id);
        
        const newSections = [...prevSections];
        const [movedSection] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, movedSection);
        
        console.log("Updated Section Order:", newSections);
        return newSections;
      });
    }
  };
  
  const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };
  
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  const handleSave = async () => {
    const portfolioData = { settings: portfolio, sections, images: uploadedImages };
    try {
      const response = await axios.post('http://localhost:5000/portfolio/create', portfolioData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const savedPortfolioId = response.data.portfolioId; // Get portfolioId from response
      localStorage.setItem('portfolioId', savedPortfolioId); // Store it in localStorage
  
      alert('Portfolio saved successfully!');
      console.log('Portfolio saved:', response.data);
    } catch (error) {
      alert('Failed to save portfolio: ' + (error.response?.data?.error || 'Unknown error'));
      console.error('Error saving portfolio:', error);
    }
  };
  
  const updatePortfolio = async (portfolioId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/portfolio/${portfolioId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) throw new Error("Failed to update portfolio");
  
      const result = await response.json();
      console.log("Portfolio updated:", result);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };
  
  const handleUpload = async (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }
    try {
      const response = await fetch('http://localhost:5000/portfolio/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await response.json();
      setUploadedImages(data.images);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleUpdate = async () => {
    if (!portfolio || !portfolio._id) {
      alert("Portfolio ID is missing. Please save your portfolio first.");
      return;
    }
    const portfolioData = { settings: portfolio, sections };
    try {
      const response = await axios.put(`http://localhost:5000/portfolio/${portfolio._id}/update`, portfolioData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Portfolio updated successfully!');
      console.log('Portfolio updated:', response.data);
    } catch (error) {
      alert('Failed to update portfolio: ' + (error.response?.data?.error || 'Unknown error'));
      console.error('Error updating portfolio:', error);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All changes will be lost.')) {
      setSections([]);
      setPortfolio({ title: '', subtitle: '', theme: 'light', author: '', contact: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-2">
              <Layout className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Profolio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Reset
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button 
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Update
              </button>

              <button onClick={handleLogout}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Logout</button>

            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Portfolio Settings Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">Portfolio by Profolio</h2>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pl-4 pr-8 w-1/4">
                      <div className="flex items-center">
                        <Layout className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Title</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        placeholder="Enter portfolio title"
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={portfolio.title}
                        onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pl-4 pr-8">
                      <div className="flex items-center">
                        <Layout className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Subtitle</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        placeholder="Enter subtitle"
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={portfolio.subtitle}
                        onChange={(e) => setPortfolio({ ...portfolio, subtitle: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pl-4 pr-8">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Author</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        placeholder="Enter author name"
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={portfolio.author}
                        onChange={(e) => setPortfolio({ ...portfolio, author: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pl-4 pr-8">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Contact</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        placeholder="Enter contact information"
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={portfolio.contact}
                        onChange={(e) => setPortfolio({ ...portfolio, contact: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-4 pr-8">
                      <div className="flex items-center">
                        <Palette className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Theme</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <select
                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        value={portfolio.theme}
                        onChange={(e) => setPortfolio({ ...portfolio, theme: e.target.value })}
                      >
                        <option value="light">✨ Light Theme</option>
                        <option value="dark">🌙 Dark Theme</option>
                        <option value="minimal">🎯 Minimal Theme</option>
                        <option value="professional">💼 Professional Theme</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sections */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sections.map(s => s.id)} 
            strategy={verticalListSortingStrategy}
          >
            {sections.map(section => (
              <Section
                key={section.id}
                id={section.id}
                data={section}
                onDelete={deleteSection}
                onUpdate={updateSection}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Add Section Button */}
        <button
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg 
                    text-gray-500 hover:border-indigo-500 hover:text-indigo-500 
                    transition-colors duration-200 flex items-center justify-center bg-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Add New Section</span>
        </button>

        </div>
      </main>
    </div>
  );
};

export default PortfolioCreator;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import axios
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { Plus, Save, Layout, User, Mail, Palette } from 'lucide-react';
// import Section from './Section';

// const PortfolioCreator = () => {
//   const [sections, setSections] = useState([]);
//   const [portfolio, setPortfolio] = useState({
//     title: '',
//     subtitle: '',
//     theme: 'light',
//     author: '',
//     contact: ''
//   });
//   const [uploadedImages, setUploadedImages] = useState([]);


//   // Fetch portfolio data from the backend when the component mounts
//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const portfolioId = 'your-portfolio-id'; // Replace with the actual portfolio ID
//         const response = await axios.get(`http://localhost:5000/portfolio/${portfolioId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token for authentication
//           },
//         });
//         const { settings, sections } = response.data;
//         setPortfolio(settings);
//         setSections(sections);
//       } catch (error) {
//         console.error('Error fetching portfolio:', error);
//       }
//     };

//     fetchPortfolio();
//   }, []);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const addSection = () => {
//     const newSection = {
//       id: `section-${Date.now()}`,
//       type: 'text',
//       title: '',
//       content: ''
//     };
//     setSections([...sections, newSection]);
//   };

//   const updateSection = (id, newData) => {
//     setSections(sections.map(section => 
//       section.id === id ? { ...section, ...newData } : section
//     ));
//   };

//   const deleteSection = (id) => {
//     if (window.confirm('Are you sure you want to delete this section?')) {
//       setSections(sections.filter(section => section.id !== id));
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       const oldIndex = sections.findIndex(section => section.id === active.id);
//       const newIndex = sections.findIndex(section => section.id === over.id);
//       const newSections = [...sections];
//       const [movedSection] = newSections.splice(oldIndex, 1);
//       newSections.splice(newIndex, 0, movedSection);
//       setSections(newSections);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Remove token
//     window.location.href = "/"; // Redirect to login
//   };
  

//   const handleSave = async () => {
//     const portfolioData = {
//         settings: portfolio,
//         sections: sections,
//         images: uploadedImages,  // Include images
//     };

//     try {
//         const response = await axios.post('http://localhost:5000/portfolio/create', portfolioData, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });

//         alert('Portfolio saved successfully!');
//         console.log('Portfolio saved:', response.data);
//     } catch (error) {
//         alert('Failed to save portfolio: ' + (error.response?.data?.error || 'Unknown error'));
//         console.error('Error saving portfolio:', error);
//     }
// };


// const handleUpload = async (files) => {
//   const formData = new FormData();
//   for (const file of files) {
//     formData.append('images', file);
//   }

//   try {
//     const response = await fetch('http://localhost:5000/portfolio/upload', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();
//     setUploadedImages(data.images); // Assuming response contains uploaded image URLs
//     alert('Images uploaded successfully!');
//   } catch (error) {
//     console.error('Upload failed:', error);
//   }
// };


// const handleUpdate = async () => {
//   if (!portfolio || !portfolio._id) {
//       alert("Portfolio ID is missing. Please save your portfolio first.");
//       return;
//   }

//   const portfolioData = {
//       settings: portfolio,
//       sections: sections
//   };

//   try {
//       const response = await axios.put(`http://localhost:5000/portfolio/${portfolio._id}/update`, portfolioData, {
//           headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token for authentication
//           },
//       });

//       alert('Portfolio updated successfully!');
//       console.log('Portfolio updated:', response.data);
//   } catch (error) {
//       alert('Failed to update portfolio: ' + (error.response?.data?.error || 'Unknown error'));
//       console.error('Error updating portfolio:', error);
//   }
// };


//   const handleReset = () => {
//     if (window.confirm('Are you sure you want to reset? All changes will be lost.')) {
//       setSections([]);
//       setPortfolio({
//         title: '',
//         subtitle: '',
//         theme: 'light',
//         author: '',
//         contact: ''
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Navigation Bar */}
//       <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
//         <div className="container mx-auto px-4 h-16">
//           <div className="flex justify-between items-center h-full">
//             <div className="flex items-center space-x-2">
//               <Layout className="w-6 h-6 text-indigo-600" />
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Profolio
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
//               >
//                 Reset
//               </button>
//               <button 
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 Save
//               </button>
//               <button 
//                 onClick={handleUpdate}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 Update
//               </button>

//               <button onClick={handleLogout}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 Logout</button>

//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="container mx-auto px-4 pt-24 pb-8">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Portfolio Settings Table */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center space-x-2">
//                 <Palette className="w-5 h-5 text-indigo-600" />
//                 <h2 className="text-lg font-semibold text-gray-800">Portfolio by Profolio</h2>
//               </div>
//             </div>
//             <div className="p-4">
//               <table className="w-full">
//                 <tbody>
//                   <tr className="border-b border-gray-100">
//                     <td className="py-3 pl-4 pr-8 w-1/4">
//                       <div className="flex items-center">
//                         <Layout className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-600">Title</span>
//                       </div>
//                     </td>
//                     <td className="py-3">
//                       <input
//                         type="text"
//                         placeholder="Enter portfolio title"
//                         className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={portfolio.title}
//                         onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
//                       />
//                     </td>
//                   </tr>
//                   <tr className="border-b border-gray-100">
//                     <td className="py-3 pl-4 pr-8">
//                       <div className="flex items-center">
//                         <Layout className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-600">Subtitle</span>
//                       </div>
//                     </td>
//                     <td className="py-3">
//                       <input
//                         type="text"
//                         placeholder="Enter subtitle"
//                         className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={portfolio.subtitle}
//                         onChange={(e) => setPortfolio({ ...portfolio, subtitle: e.target.value })}
//                       />
//                     </td>
//                   </tr>
//                   <tr className="border-b border-gray-100">
//                     <td className="py-3 pl-4 pr-8">
//                       <div className="flex items-center">
//                         <User className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-600">Author</span>
//                       </div>
//                     </td>
//                     <td className="py-3">
//                       <input
//                         type="text"
//                         placeholder="Enter author name"
//                         className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={portfolio.author}
//                         onChange={(e) => setPortfolio({ ...portfolio, author: e.target.value })}
//                       />
//                     </td>
//                   </tr>
//                   <tr className="border-b border-gray-100">
//                     <td className="py-3 pl-4 pr-8">
//                       <div className="flex items-center">
//                         <Mail className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-600">Contact</span>
//                       </div>
//                     </td>
//                     <td className="py-3">
//                       <input
//                         type="text"
//                         placeholder="Enter contact information"
//                         className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={portfolio.contact}
//                         onChange={(e) => setPortfolio({ ...portfolio, contact: e.target.value })}
//                       />
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-3 pl-4 pr-8">
//                       <div className="flex items-center">
//                         <Palette className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-600">Theme</span>
//                       </div>
//                     </td>
//                     <td className="py-3">
//                       <select
//                         className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                         value={portfolio.theme}
//                         onChange={(e) => setPortfolio({ ...portfolio, theme: e.target.value })}
//                       >
//                         <option value="light">✨ Light Theme</option>
//                         <option value="dark">🌙 Dark Theme</option>
//                         <option value="minimal">🎯 Minimal Theme</option>
//                         <option value="professional">💼 Professional Theme</option>
//                       </select>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Sections */}
//           <DndContext 
//             sensors={sensors}
//             collisionDetection={closestCenter} 
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext 
//               items={sections.map(s => s.id)} 
//               strategy={verticalListSortingStrategy}
//             >
//               {sections.map(section => (
//                 <Section
//                   key={section.id}
//                   id={section.id}
//                   data={section}
//                   onDelete={deleteSection}
//                   onUpdate={updateSection}
//                 />
//               ))}
//             </SortableContext>
//           </DndContext>

//           {/* Add Section Button */}
//           <button
//             onClick={addSection}
//             className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors duration-200 flex items-center justify-center bg-white"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             <span>Add New Section</span>
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PortfolioCreator;