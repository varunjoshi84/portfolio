import NavigationBar from '@/components/NavigationBar';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      <NavigationBar />
      <HeroSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
