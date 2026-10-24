/** The normal website uses its URL; a standalone view receives its owning file URL. */
export function gameURL() {
  return new URL(globalThis.__aquariumStandaloneRoute || location.href);
}
export function navigateGame(href) {
  if(globalThis.__aquariumStandaloneRoute) return parent.aquariumStandaloneNavigate(new URL(href,gameURL()).href);
  location.assign(new URL(href,gameURL()).href);
}
