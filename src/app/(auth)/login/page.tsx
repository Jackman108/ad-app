import { LoginForm } from '@/features/auth-ui/ui/LoginForm';
import styles from '../auth.module.css';

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Вход</h1>
      <p className={styles.lead}>Email и пароль · Беларусь</p>
      <LoginForm />
    </main>
  );
}
