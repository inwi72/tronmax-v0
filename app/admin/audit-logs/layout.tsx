export default function AuditLogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="audit-logs-container">
      {children}  {/* This renders the page.tsx content */}
    </div>
  )
}