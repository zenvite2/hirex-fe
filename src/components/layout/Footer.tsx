import { footerLinks } from "../../utils/data";
import { Link } from "react-router-dom";

// Define types for footer links
interface FooterLink {
  id: string;
  title: string;
  links: string[];
}

// Define the props for the Footer component
interface FooterProps {
  footerLinks: FooterLink[];
}

const Footer = () => {
  return (
    <footer className='text-white mp-20'>
      <div className='overflow-x-hidden -mb-0.5'>
      </div>

      <div className='bg-purple-600'>
        <div className='container px-5 py-20 mx-auto'>
          <div className='w-full flex flex-wrap gap-10 justify-between -mb-10 -px-4'>
            {footerLinks.map(({ id, title, links }) => (
              <div className='w-auto px-4' key={id + title}>
                <h2 className='font-large text-white tracking-widest text-lg mb-3'>
                  {title}
                </h2>

                <div className='mb-10 flex flex-col gap-3'>
                  {links.map((link, index) => (
                    <Link
                      key={link + index}
                      to='/'
                      className='text-gray-300 text-sm hover:text-white'
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-purple-900'>
          <div className='container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row'>
            <p className='text-gray-300 text-sm text-center sm:text-left'>
              &copy; 2023 JobFinder —
              <a
                href='https://www.linkedin.com/in/thatonekrish/'
                className='text-[#1199e7] ml-1'
                target='_blank'
                rel='noopener noreferrer'
              >
                @ThatOneKrish
              </a>
            </p>

            <span className='sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-300 text-sm'>
              Designed by ThatOneKrish
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
