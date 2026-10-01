export type PageTarget = {
  path: string;
  name: string;
  maskSelectors?: string[];
};

export const pages: PageTarget[] = [
  { path: "/", name: "home-page" },
  { name: "Search", path: "/search/" },
  { name: "Privacy Policy", path: "/privacy-policy/" },
  { name: "Terms & Conditions", path: "/terms-conditions/" },
  { name: "Where We Work", path: "/where-we-work/" },
  {
    name: "People Working in Tea",
    path: "/who-we-work-with/people-working-in-tea/",
  },
  { name: "Stories", path: "/stories/" },
  { name: "News & Events", path: "/news-events/" },
  { name: "History", path: "/history/" },
  { name: "Media", path: "/media/" },
  { name: "Environment", path: "/our-strategy/environment/" },
  { name: "Equality", path: "/our-strategy/equality/" },
  { name: "Economics", path: "/our-strategy/economics/" },
  { name: "Our Strategy", path: "/our-strategy/" },
  { name: "Contact", path: "/contact/" },
  { name: "FAQs", path: "/faqs/" },
  { name: "Our Programmes", path: "/our-programmes/" },
  {
    name: "Diverse Partnerships",
    path: "/who-we-work-with/diverse-partnerships/",
  },
  { name: "India", path: "/where-we-work/india/" },
  { name: "Indonesia", path: "/where-we-work/indonesia/" },
  { name: "Malawi", path: "/where-we-work/malawi/" },
  { name: "Sri Lanka", path: "/where-we-work/sri-lanka/" },
  { name: "Kenya", path: "/where-we-work/kenya/" },
  { name: "Rwanda", path: "/where-we-work/rwanda/" },
  { name: "Become a Member", path: "/become-a-member/" },
  { name: "Resources", path: "/resources/" },
  { name: "Membership", path: "/membership/" },
  { name: "How to Become a Member", path: "/how-to-become-a-member/" },
  { name: "About Us", path: "/about-us/" },
  { name: "Governance", path: "/governance/" },
  { name: "Our Members", path: "/our-members/" },
  { name: "Careers", path: "/careers/" },
  { name: "Our Team", path: "/our-team/" },
];
