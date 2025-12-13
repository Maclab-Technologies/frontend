
import SignupClient from './SignupClient'

export const metadata = {
    title: 'Register - 59Minutes Print',
    description: 'Create your account to start printing with 59Minutes Print. Fast, reliable, and high-quality printing services at your fingertips.',
}

export default async function  RegisterPage({searchParams}) {
    const { promoCode  } = await searchParams
    return <SignupClient promoCode={promoCode} />
}