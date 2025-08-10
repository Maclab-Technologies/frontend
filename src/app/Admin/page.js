import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to auth page by default
  redirect('/Admin/auth')
}