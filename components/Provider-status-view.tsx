interface ProviderStatusViewProps {
  providerId: string
}

export function ProviderStatusView({ providerId }: ProviderStatusViewProps) {
  return (
    <div>
      <h1>Provider Status</h1>
      <p>Provider ID: {providerId}</p>
    </div>
  )
}
