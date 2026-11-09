// AVA-supplied photographs and the remaining temporary visual references.
// Reference originals and source URLs are recorded in public/media/sources.json.
export const media = {
  footer: "/media/ava-footer.webp",
  hero: "/media/ava-hero.webp",
  campaign: Array.from(
    { length: 6 },
    (_, index) => `/media/campaign-0${index + 1}.jpg`,
  ),
  procedures: {
    bbl: "/media/ava-bbl.webp",
    liposuccion: "/media/ava-liposuction.webp",
    abdominoplastia: "/media/ava-tummy-tuck.webp",
    "aumento-de-pecho": "/media/ava-breast-augmentation.webp",
    "levantamiento-de-pecho": "/media/ava-breast-lift.webp",
    "reduccion-de-pecho": "/media/ava-breast-reduction.webp",
    rinoplastia: "/media/ava-rhinoplasty.webp",
    "lifting-facial": "/media/ava-facelift.webp",
    "mommy-makeover": "/media/ava-mommy-makeover.webp",
  },
} as const;
