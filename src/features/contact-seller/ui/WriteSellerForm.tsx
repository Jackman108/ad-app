import styles from './write-seller-form.module.css';

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export function WriteSellerForm({ action }: Props) {
  return (
    <form className={styles.form} action={action}>
      <label className={styles.label}>
        Написать продавцу
        <textarea
          className={styles.textarea}
          name="body"
          required
          minLength={1}
          maxLength={4000}
          rows={3}
          placeholder="Здравствуйте! Объявление ещё актуально?"
        />
      </label>
      <button className={styles.submit} type="submit">
        Отправить
      </button>
    </form>
  );
}
