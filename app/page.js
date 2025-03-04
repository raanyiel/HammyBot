export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Discord Role Bot</h1>
        <p className="text-xl mb-4">Your Discord bot is ready!</p>
        <p className="mb-2">To register commands, visit:</p>
        <code className="bg-gray-800 text-white p-2 rounded mb-8">/api/discord/register</code>
  
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Available Commands:</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-mono">/role assign @user @role</p>
            <p className="text-gray-600 mb-4">Adds a role to a user</p>
  
            <p className="font-mono">/role unassign @user @role</p>
            <p className="text-gray-600">Removes a role from a user</p>
          </div>
        </div>
      </main>
    )
  }
  
  