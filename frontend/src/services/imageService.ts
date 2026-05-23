// Premium Unsplash IDs curated for high-end look
// IDs are sourced from stable, long-standing Unsplash popular photos
const ID_POOL: Record<string, string[]> = {
  food: [
    'photo-1414235077428-338989a2e8c0', // restaurant ambiance
    'photo-1504674900247-0877df9cc836', // food overhead
    'photo-1540189549336-e6e99c3679fe', // colorful salad
    'photo-1565299624-28258bb44097',    // pizza
    'photo-1555939594-58d7cb561ad1',    // burgers
    'photo-1567620905732-2d1ec7ab7445', // pancakes
    'photo-1484723091779-ee060243c915', // avocado toast
    'photo-1546069901-ba9599a7e63c',    // salad bowl
    'photo-1512621776951-a57141f2eefd', // fruit platter
    'photo-1490645935967-10de6ba17061', // breakfast bowl
    'photo-1432139555190-58524dae6a55', // pasta
    'photo-1551024739-78d2b45c3dc3',    // sushi
    'photo-1547592180-85f173990554',    // fine dining
    'photo-1482049016688-2d3e1b311543', // eggs and toast
    'photo-1561043433-aaf687c4cf04',    // burger close-up
    'photo-1498837167922-ddd27525d352', // veggie spread
    'photo-1473093226795-af9932fe5856', // wine and food
    'photo-1567306226416-28f0efdc88ce', // tomato soup
    'photo-1471637257587-2e4c8bb6f62d', // hot chocolate
    'photo-1504544750208-dc0358e63f7f', // sushi platter
  ],
  wellness: [
    'photo-1544367567-0f2fcb009e0b',    // yoga pose
    'photo-1540555700478-4be289fbecef', // spa stones
    'photo-1552693673-1bf958298935',    // meditation
    'photo-1519823551278-64ac92734fb1', // zen garden
    'photo-1506126613408-c77c1d11b51c', // lake reflection
    'photo-1515377905703-c4788e51af15', // morning yoga
    'photo-1588286840104-8957b019727f', // aromatherapy
    'photo-1600334129128-685c5582fd35', // massage spa
    'photo-1545205597-3d9d02c29597',    // pilates
    'photo-1571019613454-1cb2f99b2d8b', // wellness routine
    'photo-1453847668862-487637052f8a', // woman meditating
    'photo-1536623975707-c4b3b2af565d', // wellness retreat
    'photo-1556909114-f6e7ad7d3136', // skincare wellness
    'photo-1416879595882-3373a0480b5b', // nature walk
    'photo-1497366811353-6870744d04b2', // zen space
    'photo-1518611012118-29a8bd38cd4c', // morning stretch
    'photo-1505327822430-886e0afe1d47', // peaceful sunset
    'photo-1531946227984-13e5e74ec52c', // relaxation
    'photo-1574484284002-952d92456975', // body massage
    'photo-1600618528240-fb9fc964b853', // spa day
  ],
  gym: [
    'photo-1534438327276-14e5300c3a48', // gym equipment
    'photo-1517836357463-d25dfeac3438', // weightlifting
    'photo-1571019613454-1cb2f99b2d8b', // personal training
    'photo-1549060279-7e168fcee0c2',    // gym workout
    'photo-1581009142202-d9624cb6135d', // training session
    'photo-1532384748853-2661c5195bf9', // barbell lift
    'photo-1548691906-cf412093a103',    // fitness center
    'photo-1583454110551-21f2fa2ec617', // dumbbell workout
    'photo-1576678927484-cc907957088c', // gym atmosphere
    'photo-1571731956622-39ed27ca9dc2', // weight rack
    'photo-1526506118085-60ce8714f8c5', // running track
    'photo-1574680096145-d05b474e2155', // strength training
    'photo-1504593811423-6dd665756598', // cardio workout
    'photo-1450101499163-c8848c66ca85', // CrossFit training
    'photo-1517343985841-f8b2d66e010b', // pull-ups
    'photo-1518310383802-640c2de311b2', // kettlebell
    'photo-1544216717-3bbf52512659', // jump rope
    'photo-1597452485669-2c7bb5fef90d', // gym motivation
    'photo-1605296867304-46d5465a13f1', // boxing
    'photo-1547447134-cd3f5c716030', // fitness class
  ],
  activity: [
    'photo-1530549387633-fca14c58e148', // sports field
    'photo-1458565660762-a4481c1ccecc', // adventure activity
    'photo-1551698618-1dfe5d97d256', // bowling
    'photo-1492684223066-81342ee5ff30', // live event
    'photo-1527525443983-6e60c75fff46', // outdoor fun
    'photo-1506905925346-21bda4d32df4', // mountain view
    'photo-1478131143081-80f7f84ca84d', // paintball
    'photo-1468436385273-8abca6dfd8d3', // karaoke
    'photo-1553481187-be93c21490a9', // gaming
    'photo-1542622524-2a5a648bb4d7', // turf football
    'photo-1500099817043-86d46000d58f', // outdoor sports
    'photo-1459865264687-595d652de67e', // team activity
    'photo-1526139334526-f591a54b477c', // night bowling
    'photo-1574201635302-388dd92a4c3f', // esports gaming
    'photo-1559827260-dc66d52bef19', // swimming pool
    'photo-1560272564-c83b66b1ad12', // cycling
    'photo-1540539234-c14a20fb7c7b', // dancing
    'photo-1508098682722-e99c43a406b2', // adventure park
    'photo-1521805103426-b7384393d4bd', // parkour
    'photo-1502570149819-b2260483d302', // archery
  ],
  coaching: [
    'photo-1522202176988-66273c2fd55f', // group coaching
    'photo-1531482615713-2afd69097998', // business coaching
    'photo-1516321318423-f06f85e504b3', // online coaching
    'photo-1552664730-d307ca884978', // team meeting
    'photo-1524178232583-02ee5c14d3a9', // classroom setting
    'photo-1434030216411-0b793f4b4173', // writing & learning
    'photo-1513258496099-48168024adb0', // laptop study
    'photo-1454165804606-c3d57bc86b40', // work session
    'photo-1571260899304-425eee4c7efc', // tennis coaching
    'photo-1553877522-43269d4ea984', // music lesson guitar
    'photo-1507679799987-c73779587ccf', // business mentoring
    'photo-1503676260728-1c00da094a0b', // swimming lesson
    'photo-1580582932707-520aed937b7b', // chess lesson
    'photo-1488190211105-8b0e65b80b4e', // coding bootcamp
    'photo-1546521343-4eb2c01aa44b', // sports coaching
    'photo-1535982330050-f1c2fb79ff78', // art workshop
    'photo-1591955506264-3f5a6834570a', // online class
    'photo-1606761568499-6d2451b23c66', // mentor session
    'photo-1604328698692-f76ea9498e76', // language class
    'photo-1543269664-7eef42226a21', // study group
  ],
};

/**
 * Returns a deterministic, category-relevant Unsplash image URL.
 * Uses the offer's id and category to consistently pick the same image per offer.
 */
export const getEliteImage = (category: string, id: string, width = 800): string => {
  const cat = category?.toLowerCase() || 'activity';
  const images = ID_POOL[cat] || ID_POOL['activity'];

  // High-performance deterministic hash — combines id + cat for variance across offers
  let hash = 0;
  const str = id + cat;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  const index = Math.abs(hash) % images.length;

  return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&q=85&w=${width}`;
};

/**
 * Returns a reliable fallback image URL (Picsum Photos) when Unsplash fails to load.
 * Seeded by offer id so the same offer always gets the same fallback image.
 */
export const getFallbackImage = (id: string, width = 800, height = 1000): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  const seed = Math.abs(hash) % 1000; // picsum supports seeds 0–999
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

/**
 * Returns a category-themed CSS gradient string used as a last-resort background
 * when all image sources fail (e.g. fully offline).
 */
export const getCategoryFallbackStyle = (category: string): string => {
  const cat = category?.toLowerCase() || 'activity';
  const gradients: Record<string, string> = {
    food:     'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #9a3412 100%)',
    wellness: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #065f46 100%)',
    gym:      'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #312e81 100%)',
    activity: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e3a8a 100%)',
    coaching: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #4c1d95 100%)',
  };
  return gradients[cat] || gradients['activity'];
};
