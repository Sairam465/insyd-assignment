import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span style={{ color: 'var(--primary)' }}>INSYD</span> Inventory
            </div>
            <nav className={styles.nav}>
                <Link href="/" className={styles.link}>
                    Dashboard
                </Link>
                <Link href="/inventory" className={styles.link}>
                    All Items
                </Link>
                <Link href="/add" className={styles.link}>
                    + Add New Item
                </Link>
            </nav>

            <div className={styles.footer}>
                <p>SDE Interview Assignment</p>
            </div>
        </aside>
    );
}
