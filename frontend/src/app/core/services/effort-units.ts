// The learning units after which the mental-effort pop-up asks (design_notes.md, section 2). The key is the unit id
// stored in effort_ratings, the route's name (so ratings join page_visits): choose once, never change.
// Module-specific; effort-rating.ts and the dialog are the same in both modules. Einstieg: Versuchsaufbau (E1) is a
// guide to the apparatus and not rated.
export const EFFORT_UNITS: Record<string, string> = {
    'e2-damped-oscillations': 'Gedämpfte Schwingungen',
    'e3-driven-oscillations': 'Getriebene Schwingungen',
    't2-free-oscillations': 'Einstieg: Theorie und Freie Schwingungen',    // T1 has a single page: rated with T2
    't3-damped-oscillations': 'Gedämpfte Schwingungen',
    't4-driven-oscillations': 'Getriebene Schwingungen',
};
