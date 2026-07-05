import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LanguagePickerModal from '../components/LanguagePickerModal'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <LanguagePickerModal />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
