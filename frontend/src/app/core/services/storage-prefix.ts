// Both modules run on the same origin (interapt.uni-goettingen.de, locally localhost:4200), and an origin has one
// localStorage for all its paths. Every key holding this module's state starts with this prefix; without it the
// modules read, show and save each other's data. Only the theme is shared on purpose.
export const STORAGE_PREFIX = 'pohl:';
