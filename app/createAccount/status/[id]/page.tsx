import { ProviderStatusView } from "@/components/Provider-status-view"

export const metadata = {
  title: "Application Status - Service Platform",
  description: "Check your service provider application status",
}

interface PageProps {
  params: {
    id: string
  }
}

export default function ProviderStatusPage({ params }: PageProps) {
  return <ProviderStatusView providerId={params.id} />
}
