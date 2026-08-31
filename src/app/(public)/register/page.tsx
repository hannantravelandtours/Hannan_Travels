import { redirect } from 'next/navigation';

export default function RegisterRedirect() {
  // Redirect directly to the student registration page
  // Teachers are added via Admin portal only
  redirect('/register/student');
}
