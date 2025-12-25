export const dynamic = "force-dynamic";
import styles from "./page.module.css";
import StatCard from "@/components/StatCard";
// other imports...


async function getDashboardData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const res = await fetch('$${API_URL}/api/dashboard', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return null;
  }
}

export default async function Home() {
  const dataResponse = await getDashboardData();
  const data = dataResponse?.data;

  // Format currency
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  if (!data) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ color: 'var(--destructive)' }}>Connection Error</h1>
        <p>Could not connect to the Backend API. Please ensure the server is running on port 5000.</p>
        <code style={{ display: 'block', marginTop: '1rem', padding: '1rem', background: '#334155' }}>
          cd server && npm start
        </code>
      </div>
    );
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Overview of inventory status and value.</p>
      </header>

      <div className={styles.grid}>
        <StatCard
          title="Total Stock Value"
          value={formatter.format(data.totalValue || 0)}
          description="Total asset value in warehouse"
        />
        <StatCard
          title="Total Items (SKUs)"
          value={data.totalItems || 0}
          description="Different products tracked"
        />
        <StatCard
          title="Low Stock Alerts"
          value={data.lowStockCount || 0}
          description="Items below minimum quantity"
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>System Status</h2>
          <span className="badge badge-green">Operational</span>
        </div>
        <p style={{ color: 'var(--muted-foreground)' }}>
          Inventory tracking is active. Real-time updates are enabled.
        </p>
      </div>
    </div>
  );
}
