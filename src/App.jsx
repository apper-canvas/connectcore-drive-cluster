import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { CRMProvider } from './context/CRMContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import Activities from './pages/Activities';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CRMProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/activities" element={<Activities />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </Router>
      </CRMProvider>
    </ThemeProvider>
  );
}

export default App;