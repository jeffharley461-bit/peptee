import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LanguagePickerModal from '../components/LanguagePickerModal'
import AgeVerificationGate from '../components/AgeVerificationGate'

export default function PublicLayout() {
  return (
    <AgeVerificationGate>
      <div className="flex flex-col min-h-screen">
        <LanguagePickerModal />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AgeVerificationGate>
  )
}
