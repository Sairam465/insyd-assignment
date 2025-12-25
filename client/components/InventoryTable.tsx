"use client";

import { useState } from 'react';
import styles from './InventoryTable.module.css';
import { useRouter } from 'next/navigation';

interface Item {
    id: number;
    sku: string;
    name: string;
    category: string;
    quantity: number;
    min_quantity: number;
    unit_price: number;
    last_updated: string;
}

export default function InventoryTable({ initialItems }: { initialItems: Item[] }) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setDeleting(id);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
            // Optimistic update
            setItems(items.filter(item => item.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setDeleting(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const isLowStock = item.quantity < item.min_quantity;
                        const isOut = item.quantity === 0;

                        let badgeClass = 'badge-green';
                        let statusText = 'In Stock';

                        if (isOut) {
                            badgeClass = 'badge-red';
                            statusText = 'Out of Stock';
                        } else if (isLowStock) {
                            badgeClass = 'badge-yellow';
                            statusText = 'Low Stock';
                        }

                        return (
                            <tr key={item.id}>
                                <td style={{ fontFamily: 'monospace' }}>{item.sku}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>{formatCurrency(item.unit_price)}</td>
                                <td>
                                    <span className={`badge ${badgeClass}`}>{statusText}</span>
                                </td>
                                <td className={styles.actions}>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        disabled={deleting === item.id}
                                    >
                                        {deleting === item.id ? '...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                No items found. Add one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
