import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-20 px-6 hero-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <AboutPage />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
