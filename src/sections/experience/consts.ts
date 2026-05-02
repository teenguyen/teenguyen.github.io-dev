/** Duration of wrap-1 / wrap-2 outer rectangle stroke draw (ms). */
export const EXPERIENCE_ANIM_DUR = 900;
/** Base delay before any wrap-1 stroke (ms). */
export const EXPERIENCE_T0 = 350;

export const CURRENT_JOB = {
  title: "senior front end engineer",
  company: "SOCIAL FINANCE",
  location: "SAN FRANCISCO CA, USA",
  dates: "MARCH 2023 – DECEMBER 2025",
  logo: "/experience/sofi.svg",
} as const;

export const PRIOR_JOBS = [
  {
    id: "lr",
    title: "senior front end engineer",
    company: "LIVERAMP",
    location: "SAN FRANCISCO, USA",
    dates: "SEP 2018 – JAN 2023",
    logo: "/experience/liveramp.svg",
  },
  {
    id: "rba",
    title: "front end / java developer",
    company: "RESERVE BANK OF AUSTRALIA",
    location: "SYDNEY, AUS",
    dates: "MAR 2016 – AUG 2018",
    logo: "/experience/rba.svg",
  },
] as const;

export const EARLY_JOBS = [
  {
    role: "it graduate",
    company: "RESERVE BANK OF AUSTRALIA",
    year: "2014",
    logo: "/experience/rba.svg",
  },
  {
    role: "developer operations",
    company: "ING DIRECT",
    year: "2013",
    logo: "/experience/ing%20direct.svg",
  },
  {
    role: "junior java developer",
    company: "SYPLE TECHNOLOGIES",
    year: "2012",
    logo: "/experience/syple.svg",
  },
  {
    role: "junior .net developer",
    company: "MERRILL LYNCH",
    year: "2011",
    logo: "/experience/merrill%20lynch.svg",
  },
] as const;

export const EDUCATION = [
  {
    degree: "bachelor of information technology\nco-op scholarship",
    school: "UNIVERSITY OF TECHNOLOGY, SYDNEY",
  },
] as const;
