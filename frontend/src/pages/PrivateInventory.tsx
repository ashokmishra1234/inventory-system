import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import CatalogSearch from '../components/CatalogSearch';
import AddInventoryForm from '../components/AddInventoryForm';
import { RetailerInventoryItem, MasterCatalogItem } from '../types';

const PrivateInventory = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState<RetailerInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addStep, setAddStep] = useState<'search' | 'form'>('search');
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<MasterCatalogItem | null>(null);

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ price: 0, quantity: 0 });

    const isReadOnly = user?.role === 'viewer';

    const fetchInventory = async () => {
        try {
            const { data } = await client.get('/api/inventory');
            setInventory(data);
        } catch (e) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    const handleAddFromCatalog = (item: MasterCatalogItem) => {
        setSelectedCatalogItem(item);
        setAddStep('form');
    };

    const handleCreateLocal = () => {
        setSelectedCatalogItem(null);
        setAddStep('form');
    };

    const handleSuccess = () => {
        setIsAddModalOpen(false);
        setAddStep('search');
        fetchInventory();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this item from your inventory?')) return;
        try {
            await client.delete(`/api/inventory/${id}`);
            toast.success('Item removed');
            fetchInventory();
        } catch (e) {
            toast.error('Failed to remove item');
        }
    };

    const startEdit = (item: RetailerInventoryItem) => {
        setEditingId(item.id);
        setEditForm({ price: item.price, quantity: item.quantity });
    };

    const saveEdit = async (id: string) => {
        try {
            await client.put(`/api/inventory/${id}`, editForm);
            toast.success('Updated');
            setEditingId(null);
            fetchInventory();
        } catch (e) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">My Inventory</h1>
                {!isReadOnly && (
                    <Button onClick={() => { setAddStep('search'); setIsAddModalOpen(true); }}>
                        <Plus size={18} className="mr-2"/> Add Product
                    </Button>
                )}
            </div>

            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 uppercase">
                        <tr>
                            <th className="p-4">Item Name</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Qty</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Rules</th>
                            <th className="p-4">Status</th>
                            {!isReadOnly && <th className="p-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {inventory.map(item => (
                            <tr key={item.id} className="hover:bg-slate-700/50">
                                <td className="p-4 font-medium text-white">
                                    {item.custom_name || item.master_catalog?.name}
                                    {item.master_catalog && <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-1 rounded">Linked</span>}
                                </td>
                                <td className="p-4 text-mono text-slate-400">{item.sku}</td>
                                
                                {/* Editable Columns */}
                                {editingId === item.id ? (
                                    <>
                                        <td className="p-4">
                                            <input 
                                                type="number" 
                                                className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white"
                                                value={editForm.quantity}
                                                onChange={e => setEditForm({...editForm, quantity: parseInt(e.target.value)})}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input 
                                                type="number" step="0.01"
                                                className="w-24 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white"
                                                value={editForm.price}
                                                onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4 font-bold">{item.quantity}</td>
                                        <td className="p-4">${item.price}</td>
                                    </>
                                )}

                                <td className="p-4 text-xs text-slate-400">
                                    Max Disc: {item.discount_rules?.max_percent}%
                                </td>
                                <td className="p-4">
                                    {item.quantity <= item.low_stock_threshold ? (
                                        <div className="flex items-center text-red-400 gap-1 text-xs px-2 py-1 bg-red-500/10 rounded w-fit">
                                            <AlertTriangle size={12}/> Low Stock
                                        </div>
                                    ) : (
                                        <div className="text-green-400 text-xs text-center px-2 py-1 bg-green-500/10 rounded w-fit">OK</div>
                                    )}
                                </td>

                                {/* Actions */}
                                {!isReadOnly && (
                                    <td className="p-4 text-right">
                                        {editingId === item.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => saveEdit(item.id)} className="p-1 hover:bg-green-500/20 text-green-400 rounded"><Check size={18}/></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><X size={18}/></button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => startEdit(item)} className="p-1 hover:bg-blue-500/20 text-blue-400 rounded"><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={18}/></button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                         {inventory.length === 0 && !loading && (
                            <tr><td colSpan={isReadOnly ? 6 : 7} className="p-8 text-center text-slate-500">Inventory is empty.</td></tr>
                        )}
                    </tbody>
                 </table>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={addStep === 'search' ? "Search Catalog" : "Add to Inventory"}>
                {addStep === 'search' ? (
                    <CatalogSearch onAdd={handleAddFromCatalog} onCreateLocal={handleCreateLocal} />
                ) : (
                    <AddInventoryForm 
                        catalogItem={selectedCatalogItem} 
                        onSuccess={handleSuccess} 
                        onCancel={() => setAddStep('search')}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PrivateInventory;
