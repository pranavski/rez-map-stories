export interface Film {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    nation: string;
  };
  synopsis: string;
  themes: string[];
  keyIssues: string[];
  illumination: string;
  readings: {
    title: string;
    author: string;
    url?: string;
  }[];
  year?: number;
  directors?: string[];
  availableOn?: string;
}

export const films: Film[] = [
  {
    id: "biidaaban",
    title: "Biidaaban (First Light)",
    location: {
      lat: 43.6532,
      lng: -79.3832,
      name: "Toronto, Ontario",
      nation: "Anishinaabe Territory"
    },
    synopsis: "An Anishinaabe woman navigates a post-apocalyptic Toronto, connecting with her ancestors and the land through traditional knowledge and resilience.",
    themes: ["Land reclamation", "Futurism", "Indigenous persistence"],
    keyIssues: ["Settler colonialism", "Urban Indigenous experience", "Environmental justice"],
    illumination: "Biidaaban reimagines Toronto as Indigenous space, challenging settler narratives of permanence and demonstrating how Indigenous peoples persist and thrive despite ongoing colonization. The film presents a decolonized future where the land returns to its original stewards.",
    readings: [
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      },
      {
        title: "Settler Colonialism and the Elimination of the Native",
        author: "Patrick Wolfe"
      }
    ],
    year: 2018,
    directors: ["Amanda Strong", "Leanne Betasamosake Simpson"]
  },
  {
    id: "drunktown-finest",
    title: "Drunktown's Finest",
    location: {
      lat: 35.6870,
      lng: -108.7425,
      name: "Gallup, New Mexico",
      nation: "Navajo Nation"
    },
    synopsis: "Three young Navajo people navigate identity, tradition, and modernity in Gallup, New Mexico, known as 'Drunktown.' Their stories intersect through themes of gender, military service, and adoption.",
    themes: ["Gender identity", "Two-Spirit identity", "Military colonialism"],
    keyIssues: ["Gender", "Settler colonialism", "Identity formation", "Adoption and displacement"],
    illumination: "The film illustrates Wesley Thomas's concepts of Navajo gender constructions while revealing how settler colonialism creates conditions that force Indigenous people into institutions like the military. It demonstrates the complexity of contemporary Indigenous identity formation.",
    readings: [
      {
        title: "Navajo Cultural Constructions of Gender and Sexuality",
        author: "Wesley Thomas"
      },
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2014,
    directors: ["Sydney Freeland"],
    availableOn: "Streaming services"
  },
  {
    id: "rhymes-for-young-ghouls",
    title: "Rhymes for Young Ghouls",
    location: {
      lat: 48.0,
      lng: -66.0,
      name: "Mi'gMaq Territory",
      nation: "Mi'kmaq First Nation, Quebec"
    },
    synopsis: "In 1976, a Mi'kmaq teenager fights back against the Indian Agent who enforces mandatory attendance at residential schools, using her wit and community networks to resist colonial violence.",
    themes: ["Residential schools", "Resistance", "Youth agency"],
    keyIssues: ["Settler colonialism", "Cultural genocide", "Gender and power", "Community resistance"],
    illumination: "This film starkly portrays Wolfe's 'elimination of the native' through the residential school system while centering Indigenous resistance. It shows how colonial institutions specifically targeted Indigenous children and families, yet communities found ways to resist and protect their members.",
    readings: [
      {
        title: "Settler Colonialism and the Elimination of the Native",
        author: "Patrick Wolfe"
      },
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2013,
    directors: ["Jeff Barnaby"]
  },
  {
    id: "reservation-dogs-s01e01",
    title: "Reservation Dogs S01E01: 'Fuckin' Rez Dogs'",
    location: {
      lat: 35.8989,
      lng: -95.2558,
      name: "Okern, Oklahoma",
      nation: "Muscogee (Creek) Nation"
    },
    synopsis: "Four Indigenous teenagers in rural Oklahoma plan to raise money to escape to California, navigating poverty, grief, and dreams while staying connected to their community and culture.",
    themes: ["Contemporary Indigenous youth", "Community", "Dreams and aspiration"],
    keyIssues: ["Settler colonialism's ongoing impacts", "Economic marginalization", "Indigenous humor and resilience"],
    illumination: "Shows the daily realities of contemporary reservation life while refusing deficit narratives. The series demonstrates how settler colonialism's structural violence manifests in limited opportunities while celebrating Indigenous community bonds, humor, and cultural continuity.",
    readings: [
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2021,
    directors: ["Sterlin Harjo", "Taika Waititi"],
    availableOn: "Hulu"
  },
  {
    id: "reservation-dogs-s01e02",
    title: "Reservation Dogs S01E02: 'NDN Clinic'",
    location: {
      lat: 35.8989,
      lng: -95.2558,
      name: "Okern, Oklahoma",
      nation: "Muscogee (Creek) Nation"
    },
    synopsis: "The group navigates the underfunded Indian Health Services clinic, revealing systemic healthcare inequities while maintaining cultural practices and community care networks.",
    themes: ["Healthcare sovereignty", "Structural violence", "Community care"],
    keyIssues: ["Settler colonialism's infrastructure", "Health disparities", "Indigenous knowledge systems"],
    illumination: "Exposes how settler colonial structures create healthcare deserts while Indigenous communities maintain traditional healing and care networks. Demonstrates Wolfe's concept of ongoing elimination through institutional neglect.",
    readings: [
      {
        title: "Settler Colonialism and the Elimination of the Native",
        author: "Patrick Wolfe"
      },
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2021,
    directors: ["Sterlin Harjo", "Taika Waititi"],
    availableOn: "Hulu"
  },
  {
    id: "sami-blood",
    title: "Sami Blood (Sameblod)",
    location: {
      lat: 67.8558,
      lng: 20.2253,
      name: "Lapland",
      nation: "Sápmi (Sami Territory), Sweden"
    },
    synopsis: "A young Sami girl in 1930s Sweden faces brutal racism and cultural erasure at a boarding school, leading her to reject her heritage to survive in Swedish society, with lasting consequences.",
    themes: ["Assimilation trauma", "Racial science", "Cultural loss"],
    keyIssues: ["Settler colonialism in Scandinavia", "Gender and colonization", "Indigenous erasure", "Internalized colonialism"],
    illumination: "Reveals how Nordic settler colonialism employed racial science and forced assimilation to eliminate Sami identity. Shows the gendered dimensions of colonial violence and the profound personal costs of survival strategies under colonial regimes.",
    readings: [
      {
        title: "Settler Colonialism and the Elimination of the Native",
        author: "Patrick Wolfe"
      },
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2016,
    directors: ["Amanda Kernell"],
    availableOn: "Kanopy"
  },
  {
    id: "tia-and-piujuq",
    title: "Tia and Piujuq",
    location: {
      lat: 63.7467,
      lng: -68.5170,
      name: "Nunavik",
      nation: "Inuit Territory, Northern Quebec"
    },
    synopsis: "A young Inuk girl forms a bond with a polar bear cub, learning traditional knowledge and navigating the challenges of Arctic life while maintaining her cultural connections.",
    themes: ["Traditional knowledge", "Land relationships", "Arctic sovereignty"],
    keyIssues: ["Climate change", "Cultural transmission", "Land-based education"],
    illumination: "Centers Inuit knowledge systems and relationships with the land, offering a decolonizing methodology that prioritizes Indigenous ways of knowing. Demonstrates how traditional knowledge provides frameworks for understanding and responding to contemporary challenges.",
    readings: [
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2024,
    directors: ["Lucy Tulugarjuk"],
    availableOn: "Apple TV+"
  },
  {
    id: "hunt-for-wilderpeople",
    title: "Hunt for the Wilderpeople",
    location: {
      lat: -38.6857,
      lng: 178.0174,
      name: "New Zealand Bush",
      nation: "Aotearoa (Māori Territory)"
    },
    synopsis: "A rebellious Māori foster child and his foster uncle flee into the New Zealand wilderness, forming an unlikely bond while evading authorities in this heartwarming adventure.",
    themes: ["Foster care systems", "Belonging", "Land connection"],
    keyIssues: ["Settler colonialism's child welfare systems", "Indigenous displacement", "Cultural identity"],
    illumination: "Critiques New Zealand's child welfare system as a continuation of colonial practices that separate Indigenous children from their communities. Shows how connection to land and cultural mentorship provide alternative frameworks for care and belonging.",
    readings: [
      {
        title: "Settler Colonialism and the Elimination of the Native",
        author: "Patrick Wolfe"
      },
      {
        title: "Decolonizing Methodologies: Research and Indigenous Peoples",
        author: "Linda Tuhiwai Smith"
      }
    ],
    year: 2016,
    directors: ["Taika Waititi"],
    availableOn: "Kanopy"
  }
];
