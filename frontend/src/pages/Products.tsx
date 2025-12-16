import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Product } from '../types';

const productSchema = z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    price: z.string().transform(v => parseFloat(v)),
    quantity: z.string().transform(v => parseInt(v, 10)),
    location: z.string().optional()
});

const Products = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm({
        resolver: zodResolver(productSchema)
    });

    const isEditor = user?.role === 'admin' || user?.role === 'manager';

    const fetchProducts = async () => {
        try {
            const { data } = await client.get('/products');
            setProducts(data);
            setFiltered(data);
        } catch (e) { toast.error('Failed to load products'); }
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        setFiltered(products.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            p.sku.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, products]);

    const openModal = (product?: Product) => {
        if (product) {
            setEditing(product);
            setValue('name', product.name);
            setValue('sku', product.sku);
            setValue('price', String(product.price));
            setValue('quantity', String(product.quantity));
            setValue('location', product.location);
        } else {
            setEditing(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (data: any) => {
        try {
            if (editing) {
                await client.put(`/products/${editing.id}`, data);
                toast.success('Product updated');
            } else {
                await client.post('/products', data);
                toast.success('Product created');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm('Delete this product?')) return;
        try {
            await client.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchProducts();
        } catch (e) { toast.error('Delete failed'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">Products</h1>
                {isEditor && (
                    <Button onClick={() => openModal()}><Plus size={18} className="mr-2"/> Add Product</Button>
                )}
            </div>

            <Card className="p-4 flex items-center gap-2">
                <Search className="text-slate-500" size={20}/>
                <input 
                    placeholder="Search by name or SKU..." 
                    className="bg-transparent outline-none text-white w-full placeholder:text-slate-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Card>

            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Location</th>
                            {isEditor && <th className="p-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-sm">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 font-medium text-white">{p.name}</td>
                                <td className="p-4 text-mono text-slate-400">{p.sku}</td>
                                <td className="p-4">${p.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.quantity < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {p.quantity}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">{p.location || '-'}</td>
                                {isEditor && (
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => openModal(p)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit size={16}/></button>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16}/></button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="p-8 text-center text-slate-500">No products found.</div>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Product' : 'New Product'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Name" {...register('name')} />
                    <Input label="SKU" {...register('sku')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Price ($)" type="number" step="0.01" {...register('price')} />
                        <Input label="Quantity" type="number" {...register('quantity')} />
                    </div>
                    <Input label="Location" {...register('location')} />
                    <Button type="submit" className="w-full">Save Product</Button>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
