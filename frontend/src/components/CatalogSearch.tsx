import React, { useState } from 'react';
import { Search, Plus, AlertCircle } from 'lucide-react';
import client from '../api/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { MasterCatalogItem } from '../types';
import toast from 'react-hot-toast';

interface CatalogSearchProps {
    onAdd: (item: MasterCatalogItem) => void;
    onCreateLocal: () => void;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ onAdd, onCreateLocal }) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<MasterCatalogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        
        setLoading(true);
        try {
            const { data } = await client.get(`/api/catalog?search=${search}`);
            setResults(data);
            setSearched(true);
        } catch (error) {
            toast.error('Failed to search catalog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-white">Add New Product</h2>
                <p className="text-slate-400">Step 1: Check if we have it in the Master Catalog</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <Input 
                    placeholder="Search by name (e.g. iPhone)..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                    <Search size={18} className="mr-2"/> Search
                </Button>
            </form>

            <div className="space-y-2">
                {results.map(item => (
                    <Card key={item.id} className="p-4 flex justify-between items-center bg-slate-800 border-slate-700">
                        <div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className="text-sm text-slate-400">SKU: {item.sku} | Category: {item.category}</p>
                            <p className="text-xs text-green-400 mt-1">Wholesaler: {item.wholesaler_info?.name}</p>
                        </div>
                        <Button onClick={() => onAdd(item)} variant="secondary" className="text-sm">
                            <Plus size={16} className="mr-1"/> Sell This
                        </Button>
                    </Card>
                ))}

                {searched && results.length === 0 && (
                    <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <AlertCircle className="mx-auto h-8 w-8 text-slate-500 mb-2"/>
                        <p className="text-slate-400 mb-4">Item not found in Master Catalog.</p>
                        <Button onClick={onCreateLocal} variant="outline">Create Custom Item</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogSearch;
