import { RegisterForm } from '@/features/auth-ui/ui/RegisterForm';
import styles from '../auth.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Регистрация</h1>
      <p className={styles.lead}>Частное лицо · email и пароль</p>
      <RegisterForm />
    </main>
  );
}
