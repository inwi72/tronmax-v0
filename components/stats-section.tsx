export function StatsSection() {
  // In a real app, these would come from your database/API
  const stats = {
    totalUsers: 123,
    totalClaims: 456,
    totalStaked: 7890.5,
  }

  return (
    <section className="text-center py-8 text-gray-300 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <p className="text-sm">Registered Users</p>
            <p className="text-2xl font-bold text-tronmax-green">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-4">
            <p className="text-sm">Total Claims</p>
            <p className="text-2xl font-bold text-tronmax-green">{stats.totalClaims.toLocaleString()}</p>
          </div>
          <div className="p-4">
            <p className="text-sm">Total Staked</p>
            <p className="text-2xl font-bold text-tronmax-green">{stats.totalStaked.toLocaleString()} TRX</p>
          </div>
        </div>
      </div>
    </section>
  )
}
