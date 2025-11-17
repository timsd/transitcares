import { createFileRoute } from '@tanstack/react-router'
import Mechanics from '@/pages/Mechanics'

export const Route = createFileRoute('/mechanics')({
  component: () => <Mechanics />,
})
