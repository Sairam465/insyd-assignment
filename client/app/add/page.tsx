"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        quantity: 0,
        min_quantity: 10,
        unit_price: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'min_quantity' || name === 'unit_price'
                ? parseFloat(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch('${API_URL}/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/inventory');
                router.refresh();
            } else {
                alert('Failed to add item. SKU might be duplicate.');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1>Add New Item</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Register new stock into the system.</p>
            </header>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>SKU (Unique Code)</label>
                        <input
                            required
                            name="sku"
                            placeholder="e.g. CER-001"
                            className="input"
                            value={formData.sku}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                        <input
                            required
                            name="category"
                            placeholder="e.g. Tiles"
                            className="input"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Product Name</label>
                    <input
                        required
                        name="name"
                        placeholder="e.g. Ceramic Tile 60x60 White"
                        className="input"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Initial Qty</label>
                        <input
                            type="number"
                            required
                            name="quantity"
                            className="input"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Min Qty (Alert)</label>
                        <input
                            type="number"
                            required
                            name="min_quantity"
                            className="input"
                            value={formData.min_quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Price (₹)</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            name="unit_price"
                            className="input"
                            value={formData.unit_price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Item'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => router.back()}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
}
