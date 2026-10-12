import LegalPage from '../components/LegalPage'

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      subtitle="Delivery timelines, tracking, and handling of international shipments."
      updated="January 2025"
    >
      <h2>1. Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days of confirmed payment. Custom and pre-order
        items may require additional fulfilment time.
      </p>

      <h2>2. Delivery Timelines</h2>
      <ul>
        <li><strong>Domestic (US):</strong> 3–7 business days.</li>
        <li><strong>International:</strong> 7–21 business days depending on destination.</li>
        <li><strong>Pre-orders:</strong> as indicated on the product page.</li>
      </ul>
      <p>Timelines are estimates and may be affected by customs clearance or carrier delays.</p>

      <h2>3. Tracking</h2>
      <p>
        All orders ship with a tracking number provided via email or WhatsApp once your parcel is
        dispatched. Shipments are discreet and temperature-controlled where required.
      </p>

      <h2>4. Customs &amp; Duties</h2>
      <p>
        International customers are responsible for any customs duties or import taxes applicable
        in their country. Delays caused by customs are outside our control.
      </p>

      <h2>5. Damaged or Lost Shipments</h2>
      <p>
        If your shipment arrives damaged or is lost in transit, contact us within 7 days of receipt
        (or expected delivery) so we can investigate and resolve the issue.
      </p>

      <h2>6. Contact</h2>
      <p>
        For shipping questions, please reach out via the Contact page or WhatsApp.
      </p>
    </LegalPage>
  )
}