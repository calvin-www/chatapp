import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>AI Customer Service Chat</h1>
      <Chat />
    </main>
  );
}