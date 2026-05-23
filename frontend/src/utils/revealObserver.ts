// Shared singleton IntersectionObserver — one instance for ALL cards on the page.
// Creating one per card (100+ observers) kills performance.
type RevealCallback = () => void;
const callbackMap = new Map<Element, RevealCallback>();

let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = callbackMap.get(entry.target);
            if (cb) {
              cb();
              callbackMap.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );
  }
  return sharedObserver;
}

export function observeReveal(el: Element, onVisible: RevealCallback): () => void {
  callbackMap.set(el, onVisible);
  getObserver().observe(el);
  return () => {
    callbackMap.delete(el);
    sharedObserver?.unobserve(el);
  };
}
