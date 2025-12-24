import InventoryTable from '@/components/InventoryTable';

async function getItems() {
    try {
        const res = await fetch('http://localhost:5000/api/items', {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
    } catch (error) {
        return { data: [] };
    }
}

export default async function InventoryPage() {
    const { data: items } = await getItems();

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Inventory</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage all stock items.</p>
                </div>
                <a href="/add" className="btn">
                    + Add Item
                </a>
            </header>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <InventoryTable initialItems={items || []} />
            </div>
        </div>
    );
}
