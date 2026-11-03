import Link from 'next/link';
import { WriteSellerForm } from './WriteSellerForm';
import styles from './contact-panel.module.css';

type Props = {
  isAuthed: boolean;
  isOwner: boolean;
  phone: string | null;
  writeAction: (formData: FormData) => Promise<void>;
};

/**
 * Блок контакта на карточке: телефон только для auth (ADR 0002),
 * сделка уводится в in-app переписку, не в внешние каналы.
 */
export function ContactPanel({ isAuthed, isOwner, phone, writeAction }: Props) {
  if (isOwner) {
    return (
      <section className={styles.panel} aria-label="Контакт">
        <p className={styles.hint}>Это ваше объявление. Ответы покупателей — в «Сообщениях».</p>
      </section>
    );
  }

  if (!isAuthed) {
    return (
      <section className={styles.panel} aria-label="Контакт">
        <p className={styles.lead}>Связаться с продавцом</p>
        <p className={styles.hint}>
          <Link href="/login">Войдите</Link>, чтобы написать in-app и увидеть телефон (если указан).
        </p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="Контакт">
      <p className={styles.lead}>Связаться с продавцом</p>
      {phone ? (
        <p className={styles.phone}>
          <a href={`tel:${phone}`}>{phone}</a>
        </p>
      ) : (
        <p className={styles.hint}>Телефон не указан — договоритесь в чате.</p>
      )}
      <WriteSellerForm action={writeAction} />
    </section>
  );
}
