import LegalPage from '../components/LegalPage'

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How PeptideForge collects, uses, and protects your information."
      updated="January 2025"
    >
      <h2>1. Information We Collect</h2>
      <ul>
        <li>Contact details such as name, email address, phone, and WhatsApp number.</li>
        <li>Order and inquiry details you submit through our forms.</li>
        <li>Basic analytics data to improve our website and services.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use your information to process inquiries and orders, provide customer support, send
        product and batch updates you request, and comply with legal obligations.
      </p>

      <h2>3. Sharing &amp; Disclosure</h2>
      <p>
        We do not sell your personal information. We may share data with trusted service providers
        (such as hosting and shipping partners) strictly to deliver our services.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain personal information only as long as necessary to fulfil the purposes described
        in this policy or as required by law.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the right to access, correct, or delete your
        personal information. Contact us to exercise these rights.
      </p>

      <h2>6. Contact</h2>
      <p>
        For privacy-related requests, please reach out via the Contact page or email.
      </p>
    </LegalPage>
  )
}
