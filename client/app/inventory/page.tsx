import InventoryTable from '@/components/InventoryTable';

async function getItems() {
    try {
        console.log("API_URL =", process.env.NEXT_PUBLIC_API_URL);

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
       throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

       const res = await fetch(`${API_URL}/api/items`, {
       cache: 'no-store',
    });


        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("getItems error:", error);
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
