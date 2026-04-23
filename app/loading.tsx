import Background from '@/components/Background';

export default function Loading() {
  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="lg rounded-4xl px-10 py-10 text-center max-w-sm w-full">
          <div className="relative z-10">
            <p className="eyebrow mb-2">Loading</p>
            <h1 className="headline font-bold text-2xl text-fg mb-6">Sedo-Ta.</h1>
            <div className="relative w-40 h-1 rounded-full bg-black/5 mx-auto overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 w-12 rounded-full bg-fg"
                style={{ animation: 'load-sweep 1.4s linear infinite' }}
              />
            </div>
            <style>{`
              @keyframes load-sweep {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(320%); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
}
