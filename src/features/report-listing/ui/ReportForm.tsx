import styles from './report-form.module.css';

type Props = {
  action: (formData: FormData) => Promise<void>;
  slug: string;
};

export function ReportForm({ action, slug }: Props) {
  return (
    <form className={styles.form} action={action}>
      <input type="hidden" name="slug" value={slug} />
      <p className={styles.title}>Пожаловаться</p>
      <select className={styles.input} name="reason" defaultValue="SPAM" required>
        <option value="SPAM">Спам</option>
        <option value="FRAUD">Мошенничество</option>
        <option value="PROHIBITED">Запрещённый товар</option>
        <option value="OTHER">Другое</option>
      </select>
      <textarea
        className={styles.input}
        name="comment"
        rows={2}
        maxLength={1000}
        placeholder="Комментарий (необязательно)"
      />
      <button type="submit" className={styles.submit}>
        Отправить жалобу
      </button>
    </form>
  );
}
