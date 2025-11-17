import { useRouter } from '@tanstack/react-router'

export const useNavigate = () => {
  const router = useRouter()
  return (to: string) => router.navigate({ to })
}
