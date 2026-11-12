import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUploadCloud } from 'react-icons/fi';

const AdminInventory = () => {
    const [equipment, setEquipment] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('dailyRate', formData.dailyRate);
            data.append('securityDeposit', formData.securityDeposit);
            data.append('description', formData.description);

            if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
            if (imageFile) data.append('image', imageFile);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                await axios.put(`http://localhost:5000/api/equipment/${editingId}`, data, config);
            } else {
                await axios.post('http://localhost:5000/api/equipment', data, config);
            }
            
            closeModal();
            fetchEquipment(); 
        } catch (error) {
            console.error("Error saving equipment:", error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item._id);
        setImageFile(null); 
        setIsModalOpen(true);
    };

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

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImageFile(null);
        setFormData({ name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: '' });
    };

    // Search Filter Logic
    const filteredEquipment = equipment.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.equipmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-white">
            {/* Top Header Area (No navbar, just page title & actions) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Inventory Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your musical equipment catalog.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingId(null); setImageFile(null); setFormData({ name: '', category: '', dailyRate: '', securityDeposit: '', imageUrl: '', description: '' }); }}
                    className="flex items-center gap-2 bg-[#43B062] text-black px-5 py-2.5 rounded-lg font-bold hover:bg-green-500 transition shadow-[0_0_15px_rgba(67,176,98,0.3)]"
                >
                    <FiPlus size={20} /> Add New Equipment
                </button>
            </div>

            {/* Search Bar & Table Container */}
            <div className="bg-[#131313] border border-[#2a2a2a] rounded-xl overflow-hidden">
                
                {/* Search */}
                <div className="p-4 border-b border-[#2a2a2a]">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search equipment by name, code, or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#43B062]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 border-b border-[#2a2a2a] font-medium">Code</th>
                                <th className="p-4 border-b border-[#2a2a2a] font-medium">Equipment Name</th>
                                <th className="p-4 border-b border-[#2a2a2a] font-medium">Category</th>
                                <th className="p-4 border-b border-[#2a2a2a] font-medium">Daily Rate</th>
                                <th className="p-4 border-b border-[#2a2a2a] font-medium">Status</th>
                                <th className="p-4 border-b border-[#2a2a2a] font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map((item) => (
                                <tr key={item._id} className="hover:bg-[#1a1a1a] transition text-sm">
                                    <td className="p-4 border-b border-[#2a2a2a] font-mono text-gray-300">{item.equipmentCode || 'N/A'}</td>
                                    <td className="p-4 border-b border-[#2a2a2a] font-semibold flex items-center gap-3">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                        ) : (
                                            <div className="w-10 h-10 bg-[#2a2a2a] rounded flex items-center justify-center text-xs">No Img</div>
                                        )}
                                        {item.name}
                                    </td>
                                    <td className="p-4 border-b border-[#2a2a2a] text-gray-300">{item.category}</td>
                                    <td className="p-4 border-b border-[#2a2a2a] text-gray-300">LKR {item.dailyRate?.toLocaleString()} / day</td>
                                    <td className="p-4 border-b border-[#2a2a2a]">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${
                                            item.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                            item.status === 'Rented' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Available' ? 'bg-green-400' : item.status === 'Rented' ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                                            {item.status || 'Available'}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b border-[#2a2a2a] text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-[#2a2a2a] text-gray-300 rounded hover:text-blue-400 hover:bg-[#333] transition">
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 bg-[#2a2a2a] text-gray-300 rounded hover:text-red-400 hover:bg-[#333] transition">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEquipment.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No equipment found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1e1e1e] p-8 rounded-xl w-full max-w-lg border border-[#2a2a2a] shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingId ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Equipment Name</label>
                                <input type="text" name="name" placeholder="Enter equipment name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-[#131313] rounded-lg border border-[#2a2a2a] text-white focus:outline-none focus:border-[#43B062]" />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 bg-[#131313] rounded-lg border border-[#2a2a2a] text-white focus:outline-none focus:border-[#43B062]">
                                    <option value="">Select category</option>
                                    <option value="Guitars & Basses">Guitars & Basses</option>
                                    <option value="Keyboards & Synth">Keyboards & Synth</option>
                                    <option value="Drums & Percussion">Drums & Percussion</option>
                                    <option value="PA & Lighting">PA & Lighting</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Daily Rate (LKR)</label>
                                    <input type="number" name="dailyRate" placeholder="e.g., 5000" value={formData.dailyRate} onChange={handleChange} required className="w-full p-3 bg-[#131313] rounded-lg border border-[#2a2a2a] text-white focus:outline-none focus:border-[#43B062]" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Security Deposit (LKR)</label>
                                    <input type="number" name="securityDeposit" placeholder="e.g., 10000" value={formData.securityDeposit} onChange={handleChange} required className="w-full p-3 bg-[#131313] rounded-lg border border-[#2a2a2a] text-white focus:outline-none focus:border-[#43B062]" />
                                </div>
                            </div>
                            
                            {/* Image Upload Zone */}
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Equipment Image</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2a2a2a] rounded-lg cursor-pointer bg-[#131313] hover:bg-[#1a1a1a] transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUploadCloud size={28} className="text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max. 5MB)</p>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                                {imageFile && <p className="text-[#43B062] text-xs mt-2">Selected: {imageFile.name}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                                <textarea name="description" placeholder="Enter equipment specifications..." value={formData.description} onChange={handleChange} className="w-full p-3 bg-[#131313] rounded-lg border border-[#2a2a2a] text-white focus:outline-none focus:border-[#43B062]" rows="3"></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeModal} className="px-6 py-2.5 bg-[#2a2a2a] rounded-lg font-semibold hover:bg-[#333] transition">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[#43B062] text-black rounded-lg font-bold hover:bg-green-500 transition">Save Equipment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;