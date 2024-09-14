// components/Footer/Footer.tsx
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import { FaFacebook, FaGithub, FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <Image src={logo} alt="Logo" className="h-8 w-auto" />
        </div>
        <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
          <ul className="flex space-x-4">
            {/* <FooterListItem hrefLink='/properties'>Properties</FooterListItem>
            <FooterListItem hrefLink='/terms'>Terms of Service</FooterListItem> */}
            <FaFacebook size={45} className="bg-ourBG" />
            <FaGithub size={45} className="bg-ourBG" />
            <FaXTwitter size={45} className="bg-ourBG" />
            <FaLinkedin size={45} className="bg-ourBG" />
            <FaInstagram size={45} className="bg-ourBG" />
          </ul>
        </div>
        <div>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            &copy; {currentYear} CourseMetrics, LLC, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
