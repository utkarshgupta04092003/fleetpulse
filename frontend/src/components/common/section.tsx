import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SectionProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>
  )
}
