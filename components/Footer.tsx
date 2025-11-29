export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-gray-800">Stop the $3 Minimum</p>
          <p>Consumer-led campaign to stop illegal debit minimums.</p>
        </div>
        <div className="flex gap-4">
          <a href="https://tiktok.com/@stop3min" target="_blank" rel="noreferrer" className="hover:text-primary">
            TikTok @stop3min
          </a>
          <a href="https://instagram.com/stop3min" target="_blank" rel="noreferrer" className="hover:text-primary">
            IG @stop3min
          </a>
          <a href="/docs/for-store-owners" className="hover:text-primary">
            For store owners
          </a>
        </div>
      </div>
    </footer>
  );
}
