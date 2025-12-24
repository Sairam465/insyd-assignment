import styles from './StatCard.module.css';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ title, value, description, trend }: StatCardProps) {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.value}>{value}</div>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}
