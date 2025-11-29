export default function KnowYourRightsPage() {
  return (
    <article className="prose max-w-none prose-h1:text-3xl prose-headings:text-gray-900 prose-p:text-gray-700">
      <h1>Know Your Rights</h1>
      <p>
        Debit minimums are not allowed by card networks. If a store posts a “$3 minimum for debit” sign, they are
        breaking network rules and pushing illegal fees on customers who can least afford it.
      </p>
      <h2>Debit vs. credit</h2>
      <ul>
        <li>Credit card minimums up to $10 can be allowed under network rules.</li>
        <li>Debit card minimums are prohibited by Visa, Mastercard, and other networks.</li>
        <li>Some stores misuse the credit rule and force debit minimums anyway.</li>
      </ul>
      <h2>Durbin Amendment (high level)</h2>
      <p>
        The Durbin Amendment was designed to protect consumers and merchants from abusive interchange fees. Card
        networks set rules that explicitly ban minimums on debit transactions.
      </p>
      <h2>How to handle it</h2>
      <ul>
        <li>Stay calm and document the sign or receipt.</li>
        <li>Submit a report here so we can track patterns.</li>
        <li>Consider filing directly with the card network or your state AG (see other docs).</li>
      </ul>
      <p className="text-sm text-gray-500">This is not legal advice. It&apos;s educational info to help you push back.</p>
    </article>
  );
}
