/**
 * Carefully verified Unsplash photo IDs.
 * Each ID has been manually checked to confirm it shows content
 * that is directly relevant to its category label.
 */
const ID_POOL: Record<string, string[]> = {
  food: [
    'photo-1565299624-28258bb44097', // wood-fired pizza
    'photo-1504674900247-0877df9cc836', // food overhead spread
    'photo-1555939594-58d7cb561ad1', // gourmet burger
    'photo-1567620905732-2d1ec7ab7445', // stacked pancakes with syrup
    'photo-1546069901-ba9599a7e63c',    // salad bowl
    'photo-1512621776951-a57141f2eefd', // colorful fruit & veggie platter
    'photo-1414235077428-338989a2e8c0', // fine dining plated dish
    'photo-1540189549336-e6e99c3679fe', // colourful healthy bowl
    'photo-1484723091779-ee060243c915', // avocado toast
    'photo-1567306226416-28f0efdc88ce', // soup in bowl
  ],
  wellness: [
    'photo-1544367567-0f2fcb009e0b',    // yoga pose silhouette at sunset
    'photo-1540555700478-4be289fbecef', // spa hot stones on back
    'photo-1552693673-1bf958298935',    // person in meditation pose
    'photo-1515377905703-c4788e51af15', // morning yoga by window
    'photo-1519823551278-64ac92734fb1', // zen candles and flowers
    'photo-1453847668862-487637052f8a', // woman meditating outdoors
    'photo-1574484284002-952d92456975', // massage therapy session
    'photo-1506126613408-c77c1d11b51c', // peaceful lake reflection
    'photo-1545205597-3d9d02c29597',    // yoga/pilates class
    'photo-1616198814651-e71f960c3180', // spa bath & wellness
  ],
  gym: [
    'photo-1534438327276-14e5300c3a48', // gym equipment & weights room
    'photo-1517836357463-d25dfeac3438', // person lifting barbell
    'photo-1549060279-7e168fcee0c2',    // barbell deadlift
    'photo-1581009142202-d9624cb6135d', // personal training session
    'photo-1532384748853-2661c5195bf9', // barbell weight plates
    'photo-1583454110551-21f2fa2ec617', // dumbbell curl workout
    'photo-1526506118085-60ce8714f8c5', // running track
    'photo-1574680096145-d05b474e2155', // strength training
    'photo-1571731956622-39ed27ca9dc2', // weight room racks
    'photo-1576678927484-cc907957088c', // premium gym atmosphere
  ],
  activity: [
    'photo-1530549387633-fca14c58e148', // sports / football pitch
    'photo-1492684223066-81342ee5ff30', // live concert / event crowd
    'photo-1551698618-1dfe5d97d256',    // skateboarding trick
    'photo-1506905925346-21bda4d32df4', // outdoor adventure landscape
    'photo-1542622524-2a5a648bb4d7',   // football on turf
    'photo-1559827260-dc66d52bef19',   // swimming pool lane
    'photo-1560272564-c83b66b1ad12',   // cycling / biking
    'photo-1526139334526-f591a54b477c', // bowling alley
    'photo-1516450360452-9312f5e86fc7', // dj / music performance
    'photo-1511632765486-a01980e01a18', // group hiking adventure
  ],
  coaching: [
    'photo-1522202176988-66273c2fd55f', // people in professional meeting
    'photo-1531482615713-2afd69097998', // business presentation / coaching
    'photo-1524178232583-02ee5c14d3a9', // classroom / lecture
    'photo-1516321318423-f06f85e504b3', // online coaching laptop setup
    'photo-1434030216411-0b793f4b4173', // person writing / studying
    'photo-1552664730-d307ca884978',    // team whiteboard brainstorm
    'photo-1513258496099-48168024adb0', // laptop work session
    'photo-1454165804606-c3d57bc86b40', // professional business meeting
    'photo-1507679799987-c73779587ccf', // mentor and mentee discussion
    'photo-1580582932707-520aed937b7b', // chalkboard / teaching
  ],
};

/**
 * Returns a deterministic, category-relevant Unsplash image URL.
 * Same offer always gets the same image (hash of id + category).
 */
export const getEliteImage = (category: string, id: string, width = 600): string => {
  const cat = category?.toLowerCase() || 'activity';
  const pool = ID_POOL[cat] ?? ID_POOL['activity'];

  let hash = 0;
  const str = id + cat;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // keep as 32-bit int
  }
  const index = Math.abs(hash) % pool.length;

  return `https://images.unsplash.com/${pool[index]}?auto=format&fit=crop&q=80&w=${width}`;
};

/**
 * Picsum Photos fallback — always loads, seeded by offer id for consistency.
 */
export const getFallbackImage = (id: string, width = 600, height = 750): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) % 900;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

/**
 * Category-themed gradient — last resort when all image sources fail (offline).
 */
export const getCategoryFallbackStyle = (category: string): string => {
  const gradients: Record<string, string> = {
    food:     'linear-gradient(135deg,#f97316,#ea580c,#9a3412)',
    wellness: 'linear-gradient(135deg,#10b981,#059669,#065f46)',
    gym:      'linear-gradient(135deg,#6366f1,#4f46e5,#312e81)',
    activity: 'linear-gradient(135deg,#3b82f6,#2563eb,#1e3a8a)',
    coaching: 'linear-gradient(135deg,#8b5cf6,#7c3aed,#4c1d95)',
  };
  const cat = category?.toLowerCase() || 'activity';
  return gradients[cat] ?? gradients['activity'];
};
