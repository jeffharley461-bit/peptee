import { Link } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const SECTIONS = [
  {
    title: '1. For Research Use Only',
    body: 'All peptides and compounds sold by PeptideForge are strictly intended for laboratory and scientific research purposes only. They are not intended for, and must not be used for, any human or animal therapeutic, diagnostic, or clinical application.',
  },
  {
    title: '2. Not for Human or Animal Consumption',
    body: 'Our products are not food, drugs, supplements, or medical devices. They are not approved for human or veterinary use. Ingesting, injecting, or otherwise administering these products to humans or animals is strictly prohibited and may be illegal in your jurisdiction.',
  },
  {
    title: '3. Age & Professional Qualification',
    body: 'By placing an order with PeptideForge, you confirm that you are at least 18 years of age, that you are a qualified researcher, scientist, or licensed professional, and that you have the appropriate training and facilities to handle research chemicals safely.',
  },
  {
    title: '4. Not FDA Approved',
    body: 'None of the products sold by PeptideForge have been evaluated or approved by the U.S. Food and Drug Administration (FDA), the European Medicines Agency (EMA), or any other regulatory body for use in humans or animals. These products are not intended to diagnose, treat, cure, or prevent any disease or condition.',
  },
  {
    title: '5. Buyer Responsibility & Local Laws',
    body: 'It is the sole responsibility of the buyer to ensure that the purchase, importation, possession, and use of any peptide or compound complies with all applicable local, national, and international laws and regulations. PeptideForge assumes no liability for any misuse, illegal purchase, or non-compliant application of its products.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'PeptideForge shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use, misuse, or inability to use its products. All products are sold "as is" for research purposes, with no warranty of fitness for any particular purpose beyond the scientific research context.',
  },
  {
    title: '7. Changes to This Disclaimer',
    body: 'PeptideForge reserves the right to update or modify this disclaimer at any time without prior notice. Continued use of our platform following any such changes constitutes your acceptance of the updated terms.',
  },
]

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Disclaimer</h1>
        <p className="text-gray-500 dark:text-gray-400">Please read carefully before purchasing from PeptideForge.</p>
      </div>

      {/* Warning box */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6 mb-10 flex items-start gap-4">
        <ExclamationTriangleIcon className="h-7 w-7 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="font-bold text-amber-800 dark:text-amber-300 text-lg mb-1">For Research Use Only</h2>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            All products sold by PeptideForge are strictly for laboratory and scientific research purposes.
            They are <strong>not</strong> intended for human or animal consumption, and are <strong>not</strong> FDA approved.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{section.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Questions about our policies or compliance? Contact our team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 btn-primary text-sm px-6 py-2.5"
          >
            Contact Us
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Read the FAQ
          </Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Last updated: July 2026
        </p>
      </div>
    </div>
  )
}
