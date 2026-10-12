import LegalPage from '../components/LegalPage'

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The terms governing your use of PeptideForge products and services."
      updated="January 2025"
    >
      <h2>1. Research Use Only</h2>
      <p>
        All products sold by PeptideForge are supplied strictly for laboratory, analytical, and
        research purposes. They are <strong>not</strong> intended for human or veterinary
        consumption, diagnostic, therapeutic, or cosmetic application. By purchasing, you confirm
        you are at least 18 years old and qualified to handle research materials.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You represent and warrant that you are at least 18 years of age and that you will use all
        products in compliance with applicable laws and regulations in your jurisdiction.
      </p>

      <h2>3. Orders &amp; Payment</h2>
      <ul>
        <li>All orders are subject to acceptance and product availability.</li>
        <li>Payment must be received in full before dispatch.</li>
        <li>Pricing is listed in USD and may change without notice.</li>
        <li>We may cancel orders that appear fraudulent or non-compliant.</li>
      </ul>

      <h2>4. Shipping &amp; Risk</h2>
      <p>
        Title and risk of loss pass to the customer upon shipment. Delivery timelines are
        estimates and not guaranteed. See our Shipping Policy for details.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, PeptideForge shall not be liable for any indirect,
        incidental, or consequential damages arising from the use or misuse of its products.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about these Terms may be directed to our team via the Contact page or email.
      </p>
    </LegalPage>
  )
}
