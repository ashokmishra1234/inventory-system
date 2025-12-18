import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MasterCatalogItem } from '../types';
import client from '../api/client';
import toast from 'react-hot-toast';

const inventorySchema = z.object({
    custom_name: z.string().min(1, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.string().transform(val => parseFloat(val)).refine(val => val >= 0, "Price must be positive"),
    quantity: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 0, "Quantity must be positive"),
    low_stock_threshold: z.string().transform(val => parseInt(val, 10)).default(5),
    max_discount: z.string().transform(val => parseFloat(val)).default(0),
});

interface AddInventoryFormProps {
    catalogItem?: MasterCatalogItem | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const AddInventoryForm: React.FC<AddInventoryFormProps> = ({ catalogItem, onSuccess, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
            custom_name: catalogItem?.name || '',
            sku: catalogItem?.sku || '',
            price: catalogItem?.standard_price ? String(catalogItem.standard_price) : '',
            quantity: '0',
            low_stock_threshold: '5',
            max_discount: '10'
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                catalog_item_id: catalogItem?.id, // Link if exists
                custom_name: data.custom_name,
                sku: data.sku,
                price: data.price,
                quantity: data.quantity,
                low_stock_threshold: data.low_stock_threshold,
                discount_rules: {
                    max_percent: data.max_discount,
                    approval_required: data.max_discount > 20 // Rule: High discount needs logic (future)
                }
            };
            
            await client.post('/api/inventory', payload);
            toast.success('Added to Inventory');
            onSuccess();
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-4">
                <h3 className="text-white font-medium mb-2">Item Details</h3>
                <Input label="Name" {...register('custom_name')} error={errors.custom_name?.message as string} />
                <Input label="SKU" {...register('sku')} error={errors.sku?.message as string} disabled={!!catalogItem}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Selling Price ($)" type="number" step="0.01" {...register('price')} error={errors.price?.message as string} />
                <Input label="Initial Stock" type="number" {...register('quantity')} error={errors.quantity?.message as string} />
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-white font-medium mb-2">My Rules</h3>
                <div className="grid grid-cols-2 gap-4">
                     <Input label="Low Stock Alert At" type="number" {...register('low_stock_threshold')} />
                     <Input label="Max Discount (%)" type="number" {...register('max_discount')} />
                </div>
                <p className="text-xs text-slate-500 mt-2">Discounts above this % will require approval.</p>
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Confirm Add</Button>
            </div>
        </form>
    );
};

export default AddInventoryForm;
