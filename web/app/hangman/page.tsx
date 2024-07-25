import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default function Page() {
  revalidatePath('/hangman/create');
  redirect(`/hangman/create`);
}
