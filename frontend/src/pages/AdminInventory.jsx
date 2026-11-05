import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminInventory = () => {
    const [equipment, setEquipment] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: ''
    });
    const [imageFile, setImageFile] = useState(null); // අලුත්: Image File එක තියාගන්න
    const [editingId, setEditingId] = useState(null);

    // 1. Fetch Equipment on Load
    const fetchEquipment = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/equipment');
            setEquipment(res.data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    // 2. Handle Text/Number Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle File Input Change
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]); // තෝරන පින්තූරය state එකට දාගන්නවා
    };

    // 4. Handle Submit (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // File Upload වලට FormData ඕනේ
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('dailyRate', formData.dailyRate);
            data.append('securityDeposit', formData.securityDeposit);
            data.append('description', formData.description);

            // Edit කරද්දී පරණ image එක තියාගන්න
            if (formData.imageUrl) {
                data.append('imageUrl', formData.imageUrl);
            }

            // අලුත් ෆොටෝ එකක් තෝරලා තියෙනවා නම් ඒකත් දාන්න
            if (imageFile) {
                data.append('image', imageFile);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingId) {
                await axios.put(`http://localhost:5000/api/equipment/${editingId}`, data, config);
            } else {
                await axios.post('http://localhost:5000/api/equipment', data, config);
            }
            
            closeModal();
            fetchEquipment(); // Refresh list
        } catch (error) {
            console.error("Error saving equipment:", error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    // 5. Handle Edit Click
    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item._id);
        setImageFile(null); // අලුතෙන් ෆොටෝ එකක් තෝරන්න කලින් ඒක හිස් කරනවා
        setIsModalOpen(true);
    };

    // 6. Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/equipment/${id}`);
                fetchEquipment();
            } catch (error) {
                console.error("Error deleting equipment:", error);
            }
        }
    };

    // 7. Close Modal & Reset
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImageFile(null);
        setFormData({ name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: '' });
    };

    return (
        <div className="p-6 bg-[#131313] min-h-screen text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#43B062]">Inventory Management</h1>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingId(null); setImageFile(null); setFormData({ name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: '' }); }}
                    className="bg-[#43B062] text-black px-4 py-2 rounded font-bold hover:bg-green-600 transition"
                >
                    + Add New Gear
                </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg shadow-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#222] text-gray-400 text-sm">
                            <th className="p-4 border-b border-gray-700">Image</th>
                            <th className="p-4 border-b border-gray-700">Code</th>
                            <th className="p-4 border-b border-gray-700">Name</th>
                            <th className="p-4 border-b border-gray-700">Category</th>
                            <th className="p-4 border-b border-gray-700">Rate (LKR)</th>
                            <th className="p-4 border-b border-gray-700">Status</th>
                            <th className="p-4 border-b border-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map((item) => (
                            <tr key={item._id} className="hover:bg-[#252525] transition text-sm">
                                <td className="p-4 border-b border-gray-800">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <span className="text-gray-500 text-xs">No Img</span>
                                    )}
                                </td>
                                <td className="p-4 border-b border-gray-800">{item.equipmentCode || 'N/A'}</td>
                                <td className="p-4 border-b border-gray-800">{item.name}</td>
                                <td className="p-4 border-b border-gray-800">{item.category}</td>
                                <td className="p-4 border-b border-gray-800">{item.dailyRate}</td>
                                <td className="p-4 border-b border-gray-800">
                                    <span className={`px-2 py-1 rounded text-xs ${item.status === 'Available' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                        {item.status || 'Available'}
                                    </span>
                                </td>
                                <td className="p-4 border-b border-gray-800 flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md border border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-[#43B062]">{editingId ? 'Edit Gear' : 'Add New Gear'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input type="text" name="name" placeholder="Equipment Name" value={formData.name} onChange={handleChange} required className="p-2 bg-[#222] rounded border border-gray-700 text-white" />
                            
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="p-3 bg-[#131313] rounded border border-gray-700 focus:outline-none focus:border-[#43B062] text-white"
                            >
                                <option value="">Select Category</option>
                                <option value="Guitars & Basses">Guitars & Basses</option>
                                <option value="Keyboards & Synth">Keyboards & Synth</option>
                                <option value="Drums & Percussion">Drums & Percussion</option>
                                <option value="PA & Lighting">PA & Lighting</option>
                            </select>

                            <input type="number" name="dailyRate" placeholder="Daily Rate (LKR)" value={formData.dailyRate} onChange={handleChange} required className="p-2 bg-[#222] rounded border border-gray-700 text-white" />
                            <input type="number" name="securityDeposit" placeholder="Security Deposit (LKR)" value={formData.securityDeposit} onChange={handleChange} required className="p-2 bg-[#222] rounded border border-gray-700 text-white" />
                            
                            {/* Image Upload Field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Upload Image (Optional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="p-2 bg-[#222] rounded border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#43B062] file:text-black hover:file:bg-green-600"
                                />
                                {formData.imageUrl && !imageFile && (
                                    <span className="text-xs text-gray-500">Existing image will be kept if no new file is selected.</span>
                                )}
                            </div>

                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 bg-[#222] rounded border border-gray-700 text-white" rows="2"></textarea>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#43B062] text-black font-bold rounded hover:bg-green-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;