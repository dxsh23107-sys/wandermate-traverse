import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing records (if any)
  await prisma.itineraryItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  await prisma.websiteContent.deleteMany();
  await prisma.settings.deleteMany();

  // 2. Admin User
  const hashedPassword = await bcrypt.hash("wandermate@2301", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Wandermate Admin",
      email: "wandermate@wt.in",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin:", admin.email);

  // 3. Settings
  await prisma.settings.create({
    data: {
      id: "default",
      brandName: "Wandermate Traverse",
      tagline: "Less Talk. More Traverse.",
      whatsappNumber: "8779884225",
      instagram: "@wandermate.traversee",
      email: "wandermate@wt.in",
      phone: "+91 8779884225",
      address: "Mumbai & Himalayan Basecamps, India",
      currencySymbol: "₹",
    },
  });
  console.log("Created settings");

  // 4. Website Content
  await prisma.websiteContent.createMany({
    data: [
      {
        id: "hero",
        content: JSON.stringify({
          badge: "Curated Raw Expeditions & Hidden Trails",
          title: "Less Talk. More Traverse.",
          subtitle: "Explore untouched Himalayan valleys, living root bridges, remote deserts, and soulful backpacking trails with community-driven wanderers.",
          ctaPrimary: "Explore Trips",
          ctaSecondary: "Enquire on WhatsApp",
          coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
          stats: [
            { label: "Happy Wanderers", value: "2,400+" },
            { label: "Offbeat Trails", value: "35+" },
            { label: "Local Guides & Captains", value: "100%" },
            { label: "Community Rating", value: "4.9/5" },
          ],
        }),
      },
      {
        id: "about",
        content: JSON.stringify({
          tagline: "The Wandermate Ethos",
          title: "Born from the Raw Desire to Wander Beyond the Itinerary",
          story: "Wandermate Traverse isn't about crowded tourist buses or checklist travel. We build deep, soulful, small-group expeditions where travelers become lifelong friends. From waking up under milky way skies in Spiti to dipping into crystalline natural pools in Meghalaya, we curate adventures that challenge your limits and nourish your spirit.",
          mission: "To inspire fearless exploration by creating authentic, eco-conscious, and community-led journeys that respect local cultures and wild habitats.",
          vision: "To become the leading offbeat experiential travel platform for conscious adventurers across India and the globe.",
          values: [
            { title: "No Superficial Tourism", desc: "We skip tourist traps to immerse in raw local culture and untouched wilderness." },
            { title: "Intimate Cohorts", desc: "Capped at 10-14 travelers so every experience feels personal, safe, and collaborative." },
            { title: "Local First", desc: "We empower indigenous mountain guides, homestay owners, and tribal communities." },
            { title: "Leave No Trace", desc: "Strict zero-single-use-plastic policies across all our trekking expeditions." },
          ],
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        }),
      },
      {
        id: "whyUs",
        content: JSON.stringify({
          title: "Why Traverse With Us?",
          subtitle: "Every detail engineered for unforgettable stories, spontaneous laughs, and ultimate safety.",
          features: [
            {
              icon: "Compass",
              title: "Unmapped Offbeat Routes",
              desc: "Carefully scouted trails away from tourist throngs, featuring secret waterfalls, alpine ridges, and ancient villages.",
            },
            {
              icon: "Users",
              title: "Curated Small Groups",
              desc: "Travel with like-minded creators, solo backpackers, and nature lovers. No awkward tourist bus vibes.",
            },
            {
              icon: "ShieldCheck",
              title: "Certified Expedition Captains",
              desc: "Wilderness First Aid (WFA) certified trek leaders and experienced native mountaineers leading every batch.",
            },
            {
              icon: "Sparkles",
              title: "Authentic Stays & Meals",
              desc: "Warm wooden homestays, riverside dome tents, star-lit bonfires, and hot regional farm-to-table cuisine.",
            },
          ],
        }),
      },
      {
        id: "cta",
        content: JSON.stringify({
          title: "Ready to Escape the Ordinary?",
          subtitle: "Spots are strictly limited to keep our cohorts intimate. Reserve your seat or talk to our expedition leads on WhatsApp.",
          buttonText: "Browse All Expeditions",
          whatsappText: "Chat with an Expedition Lead",
        }),
      },
      {
        id: "footer",
        content: JSON.stringify({
          description: "Wandermate Traverse curates offbeat backpacking trips, high-altitude Himalayan treks, and soulful community expeditions across India and Southeast Asia.",
          copyright: "© 2026 Wandermate Traverse. All rights reserved. Less Talk. More Traverse.",
        }),
      },
    ],
  });
  console.log("Created website content");

  // 5. Trips Data
  const tripsData = [
    {
      title: "Spiti Valley Winter Expedition — 7 Days",
      slug: "spiti-valley-winter-expedition-7-days",
      destination: "Spiti Valley, Himachal Pradesh",
      category: "Expedition",
      duration: "7 Days / 6 Nights",
      price: 21999,
      originalPrice: 26999,
      startingLocation: "Shimla",
      endingLocation: "Shimla / Chandigarh",
      availableSeats: 8,
      dates: JSON.stringify(["15 Oct 2026", "28 Oct 2026", "10 Nov 2026", "05 Dec 2026"]),
      shortDescription: "Traverse the magical frozen realm of Middle Land. Key Monastery, Langza fossil village, Chicham Bridge, and star-studded Himalayan nights.",
      fullDescription: "Spiti Valley in autumn and winter is an otherworldly landscape of stark snow-capped mountains, turquoise frozen rivers, and ancient Tibetan Buddhist monasteries perched precariously on cliffs. Join Wandermate Traverse on this raw overland road expedition across Kinnaur and Spiti. We stay in heated traditional mud homestays, sip butter tea with monks, cross the highest suspension bridge in Asia at Chicham, and search for the elusive snow leopard in Pin Valley.",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "Visit Key Monastery at 13,668 ft and join the morning prayer chanting",
        "Cross the dizzying Chicham Bridge (Asia's highest suspension bridge at 13,596 ft)",
        "Post a postcard from Hikkim — the World's Highest Post Office",
        "Witness marine fossils dating back 500 million years in Langza village",
        "Star-gazing and astrophotography sessions in zero light-pollution skies",
        "Comfortable 4x4 / Force Traveller with experienced high-altitude Himalayan drivers"
      ]),
      inclusions: JSON.stringify([
        "6 Nights accommodation (Cozy Homestays & Boutique Mountain Lodges)",
        "Daily nutritious Breakfast and Dinner (Himachali & Spitian cuisine)",
        "Transportation in dedicated Tempo Traveller / 4x4 from Shimla to Shimla",
        "Inner Line Permits and environmental green fees",
        "Experienced Wandermate Expedition Captain & Local Spitian Guide",
        "Oxygen cylinder, first aid kit, and emergency support backup",
        "Curated bonfire nights & stargazing sessions"
      ]),
      exclusions: JSON.stringify([
        "Lunches and personal cafe expenses",
        "Travel insurance & emergency evacuation charges",
        "Monument/monastery entrance fees (if applicable)",
        "Any costs arising due to unexpected road blocks or natural delays",
        "Anything not mentioned in the inclusions list"
      ]),
      faqs: JSON.stringify([
        {
          question: "What kind of fitness level is needed for this Spiti trip?",
          answer: "This is primarily an overland road trip with moderate walks and village explorations. Basic fitness is adequate, but proper hydration and gradual acclimatization are essential due to altitudes above 12,000 ft."
        },
        {
          question: "How cold does it get in Spiti?",
          answer: "Day temperatures range between 8°C to 15°C with bright sunshine. Night temperatures can drop between -2°C to -10°C. We provide insulated homestays, heavy quilts, and traditional Bukhari room heaters."
        },
        {
          question: "What is the group size?",
          answer: "We strictly cap our batches at 10 to 12 travelers to ensure comfort, personal attention, and genuine community bonding."
        }
      ]),
      importantInfo: "Please carry thermal innerwear, windproof down jacket, UV sunglasses, high SPF sunscreen, personal medications, and a reusable water bottle. Postpaid BSNL & Jio connections work in select pockets of Kaza.",
      status: "ACTIVE",
      featured: true,
      itinerary: [
        { day: 1, title: "Shimla to Kalpa via Kinnaur Valley", description: "Depart from Shimla early morning. Drive through the breathtaking Hindustan-Tibet road along the raging Sutlej River. Check into Kalpa with magnificent views of the sacred Kinner Kailash peak.", meals: "Dinner", stay: "Kalpa Mountain View Lodge" },
        { day: 2, title: "Kalpa to Tabo via Nako Lake & Gue Mummy", description: "Traverse from lush Kinnaur into the stark moonscapes of Spiti. Stop at emerald Nako Lake and visit the 550-year-old naturally preserved monk mummy at Gue. Arrive in ancient Tabo village.", meals: "Breakfast, Dinner", stay: "Traditional Tabo Homestay" },
        { day: 3, title: "Tabo Monastery to Dhankar & Kaza", description: "Explore the 1000-year-old UNESCO Tabo Monastery, known as the Ajanta of the Himalayas. Hike up to Dhankar Monastery overlooking the confluence of Spiti and Pin rivers. Evening arrival in Kaza.", meals: "Breakfast, Dinner", stay: "Cozy Kaza Guesthouse" },
        { day: 4, title: "The High Altitude Circuit: Key, Kibber, Chicham & Hikkim", description: "Visit the iconic Key Gompa and receive blessings. Drive over Chicham gorge. Send postcards to loved ones from Hikkim post office and marvel at the giant Buddha statue in Langza under snow peaks.", meals: "Breakfast, Dinner", stay: "Cozy Kaza Guesthouse" },
        { day: 5, title: "Kaza to Pin Valley National Park & Mud Village", description: "Explore the dramatic hanging glaciers and red cliffs of Pin Valley. Walk through Mud village, meet the Bhotiya tribe, and enjoy authentic local seabuckthorn tea around the hearth.", meals: "Breakfast, Dinner", stay: "Mud Village Homestay" },
        { day: 6, title: "Kaza to Sangla / Rampur Valley", description: "Begin the return descent through the scenic Kinnaur gorges. Scenic stops for photography, river walks, and evening celebration dinner with the cohort.", meals: "Breakfast, Dinner", stay: "Riverside Camp / Hotel" },
        { day: 7, title: "Return to Shimla with Unforgettable Memories", description: "Enjoy a final hearty breakfast in the hills before driving down to Shimla. Bid warm goodbyes to your newfound travel tribe and board evening transport onwards.", meals: "Breakfast", stay: "Departure" }
      ]
    },
    {
      title: "Meghalaya Living Roots & Secret Caves Trek — 6 Days",
      slug: "meghalaya-living-roots-and-secret-caves-trek-6-days",
      destination: "Shillong, Cherrapunji & Dawki, Meghalaya",
      category: "Trek",
      duration: "6 Days / 5 Nights",
      price: 18499,
      originalPrice: 22999,
      startingLocation: "Guwahati",
      endingLocation: "Guwahati",
      availableSeats: 11,
      dates: JSON.stringify(["12 Oct 2026", "25 Oct 2026", "15 Nov 2026", "02 Dec 2026"]),
      shortDescription: "Hike through ancient bio-engineered living root bridges, cliff jump into crystal blue natural pools, and explore limestone subterranean caves in the Abode of Clouds.",
      fullDescription: "Meghalaya is nature's grandest rainforest playground. Hike down 3,500 stone steps through misty Khasi jungles to witness the marvel of the Double Decker Living Root Bridge and the turquoise Rainbow Falls. Cliff jump into clear canyon pools at Wei Sawdong, navigate prehistoric limestone caves with headlamps, and kayak on the glass-like waters of Umngot River in Shnongpdeng.",
      coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "Trek down to the world-famous Double Decker Living Root Bridge in Nongriat",
        "Hike to the secluded turquoise lagoon of Rainbow Falls",
        "Caving expedition inside Arwah and Krem Mawmluh prehistoric limestone systems",
        "Riverside camping, kayaking, and cliff jumping in crystal clear Shnongpdeng / Dawki",
        "Witness India's tallest plunge waterfall — Nohkalikai Falls",
        "Authentic Khasi tribal bamboo cuisine and musical campfire nights"
      ]),
      inclusions: JSON.stringify([
        "5 Nights stay (Boutique Cottages in Cherrapunji, Village Homestays & Riverside Camps)",
        "Breakfast and Dinner across all days with delicious local Khasi specialties",
        "Private transport (Tempo / SUV) from Guwahati Airport to Guwahati",
        "All entry fees, caving permits, life jackets, and guide charges",
        "Dedicated Wandermate Trek Captain & native Khasi cave specialist",
        "Cliff jumping and boating gear in Shnongpdeng"
      ]),
      exclusions: JSON.stringify([
        "Airfare to/from Guwahati",
        "Lunch and personal cafe treats in Shillong",
        "Adventure activities not listed (scuba / zip lining)",
        "Personal shopping and alcoholic beverages"
      ]),
      faqs: JSON.stringify([
        { question: "Is the trek to Nongriat very difficult?", answer: "The Double Decker trek involves around 3,500 stone stairs. While it requires moderate stamina, our captain maintains an easy, steady pace with multiple refreshing pitstops." },
        { question: "Can non-swimmers participate in water activities?", answer: "Yes! High-quality certified life jackets are provided for all water sessions in Dawki and river pools under captain supervision." }
      ]),
      importantInfo: "Pack lightweight quick-dry clothing, sturdy trekking shoes with good grip on wet rocks, waterproof pouch for phones, and a rain poncho.",
      status: "ACTIVE",
      featured: true,
      itinerary: [
        { day: 1, title: "Guwahati to Shillong & Umiam Lake", description: "Meet the cohort at Guwahati airport. Scenic drive to Shillong with a relaxing stop at majestic Umiam Lake. Evening exploration of Shillong's lively Police Bazar cafe culture.", meals: "Dinner", stay: "Boutique Shillong Hotel" },
        { day: 2, title: "Shillong to Cherrapunji via Wei Sawdong & Nohkalikai", description: "Journey into Sohra (Cherrapunji). Marvel at the multi-tiered Wei Sawdong falls and the dramatic plunge of Nohkalikai Falls. Explore Arwah limestone caves with ancient fossils.", meals: "Breakfast, Dinner", stay: "Cherrapunji Cliff Cottages" },
        { day: 3, title: "The Legendary Double Decker Root Bridge & Rainbow Falls Trek", description: "Descend into the mystical valley of Tyrna. Cross suspended wire bridges to reach the Double Decker Living Root Bridge. Push forward to the roaring turquoise Rainbow Falls for a refreshing dip.", meals: "Breakfast, Dinner", stay: "Nongriat Community Homestay" },
        { day: 4, title: "Nongriat to Shnongpdeng / Dawki Riverside", description: "Ascend from Nongriat and drive towards the India-Bangladesh borderlands. Arrive in the idyllic village of Shnongpdeng. Settle into riverside camps along the crystal Umngot River.", meals: "Breakfast, Dinner", stay: "Riverside Dome Tents / Bamboo Huts" },
        { day: 5, title: "Cliff Jumping, Kayaking & Cleanest Village Mawlynnong", description: "Morning kayaking, boating, and cliff jumping in emerald river waters. Visit Mawlynnong (Asia's cleanest village) and single root bridge. Evening acoustic campfire by the river.", meals: "Breakfast, Dinner", stay: "Riverside Camp" },
        { day: 6, title: "Return from Dawki to Guwahati Airport", description: "Wake up to misty river views, enjoy a warm breakfast, and drive back to Guwahati Airport with unforgettable stories and new best friends.", meals: "Breakfast", stay: "Departure" }
      ]
    },
    {
      title: "Kashmir Great Lakes Alpine Odyssey — 8 Days",
      slug: "kashmir-great-lakes-alpine-odyssey-8-days",
      destination: "Sonamarg, Vishansar, Gadsar & Naranag, Kashmir",
      category: "Trek",
      duration: "8 Days / 7 Nights",
      price: 19999,
      originalPrice: 24999,
      startingLocation: "Srinagar",
      endingLocation: "Srinagar",
      availableSeats: 6,
      dates: JSON.stringify(["05 Sep 2026", "18 Sep 2026", "01 Oct 2026"]),
      shortDescription: "Trek across 7 turquoise alpine glacial lakes, cross 13,800 ft Nichnai Pass, and camp in wild Himalayan meadows surrounded by wildflower carpets.",
      fullDescription: "Rated as one of India's most pristine alpine treks, the Kashmir Great Lakes trail traverses seven high-altitude glacial lakes nestled behind towering peaks. Each day reveals a new pristine lake with changing hues of cobalt blue and emerald green. Walk among Gujjar shepherds, cross rocky high passes, and pitch your tent beside mirror-still waters under star-studded skies.",
      coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "Camp beside the twin glacial lakes of Vishansar and Kishansar",
        "Cross Gadsar Pass at 13,800 ft with panoramic views of Himalayan ranges",
        "Witness floating icebergs on Satsar and Gangabal lakes under Mt Harmukh",
        "Authentic Kashmiri Wazwan and hot Kahwa in high alpine camps",
        "Mules for luggage, high-grade Alpine 4-season tents, and gourmet trek food",
        "Certified IMF & Wilderness Medical trek leader team"
      ]),
      inclusions: JSON.stringify([
        "7 Nights high-grade camping accommodation (Tents, sleeping bags, insulated mats)",
        "All meals from Day 1 dinner to Day 8 breakfast prepared fresh by alpine chefs",
        "Transfers from Srinagar to Sonamarg and Naranag to Srinagar",
        "Trekking permits, forest entry fees, and environmental clearances",
        "Trek Leader, local Kashmiri mountain guides, camp staff, and cooks",
        "Medical kit, pulse oximeter, and emergency oxygen supply"
      ]),
      exclusions: JSON.stringify([
        "Transport to Srinagar and personal hotel stays in Srinagar",
        "Backpack offloading fee (if required on trek)",
        "Personal gear (trekking shoes, poles, warm clothing)",
        "Emergency evacuation and insurance expenses"
      ]),
      faqs: JSON.stringify([
        { question: "How difficult is the KGL trek?", answer: "It is a moderate-to-difficult trek spanning 65 km over 6 trekking days. Good cardiovascular endurance is required." },
        { question: "What are the toilet arrangements on the trek?", answer: "We set up eco-friendly dry toilet tents at every campsite ensuring privacy and cleanliness without impacting nature." }
      ]),
      importantInfo: "Pre-requisite: Ability to jog 5km in under 35 minutes. Proper ankle-support waterproof trekking boots are mandatory.",
      status: "ACTIVE",
      featured: true,
      itinerary: [
        { day: 1, title: "Srinagar to Sonamarg Basecamp (7,800 ft)", description: "Assemble in Srinagar and drive through Sind River valley to picturesque Sonamarg. Acclimatization walk, trek briefing, and cozy alpine dinner.", meals: "Dinner", stay: "Alpine Tents Sonamarg" },
        { day: 2, title: "Sonamarg to Nichnai via Shekdur (11,500 ft)", description: "Start the trek through dense silver birch and maple forests before opening into the vast Shekdur meadows. Camp beside the gushing Nichnai stream.", meals: "Breakfast, Lunch, Dinner", stay: "Nichnai Camp" },
        { day: 3, title: "Nichnai to Vishansar Lake via Nichnai Pass (12,000 ft)", description: "Climb through rocky moraines to cross the dramatic Nichnai Pass (13,100 ft). Descend into the wide flower valley of Vishansar Lake.", meals: "Breakfast, Lunch, Dinner", stay: "Vishansar Lake Camp" },
        { day: 4, title: "Vishansar to Gadsar via Gadsar Pass (13,800 ft)", description: "The most scenic day! Cross Kishansar Lake and ascend the mighty Gadsar Pass. View both Vishansar & Kishansar together before descending to the pristine Gadsar lake.", meals: "Breakfast, Lunch, Dinner", stay: "Gadsar Camp" },
        { day: 5, title: "Gadsar to Satsar (12,000 ft)", description: "Trek over rolling alpine meadows and crystal brooks to reach Satsar — a collection of seven interconnected glacial lakes.", meals: "Breakfast, Lunch, Dinner", stay: "Satsar Camp" },
        { day: 6, title: "Satsar to Gangabal & Nundkol via Zaj Pass (11,500 ft)", description: "Cross the rocky Zaj Pass. Be stunned by the massive twin lakes of Gangabal and Nundkol resting directly under the towering face of Mt. Harmukh.", meals: "Breakfast, Lunch, Dinner", stay: "Gangabal Lakeside Camp" },
        { day: 7, title: "Rest & Exploration Day at Gangabal Lake", description: "A leisurely day to explore Gangabal's banks, try trout fishing, take photos, and celebrate the final night around the campfire.", meals: "Breakfast, Lunch, Dinner", stay: "Gangabal Lakeside Camp" },
        { day: 8, title: "Gangabal to Naranag & Drive to Srinagar", description: "Descend through lush pine forests to the ancient temple ruins of Naranag. Board vehicles back to Srinagar with triumphant smiles.", meals: "Breakfast", stay: "Departure" }
      ]
    },
    {
      title: "Rajasthan Royal Havelis & Thar Desert Safari — 5 Days",
      slug: "rajasthan-royal-havelis-and-thar-desert-safari-5-days",
      destination: "Jodhpur & Jaisalmer, Rajasthan",
      category: "Cultural",
      duration: "5 Days / 4 Nights",
      price: 14999,
      originalPrice: 18999,
      startingLocation: "Jodhpur",
      endingLocation: "Jodhpur",
      availableSeats: 14,
      dates: JSON.stringify(["20 Oct 2026", "08 Nov 2026", "24 Nov 2026", "18 Dec 2026"]),
      shortDescription: "Experience the Golden City, stargaze on remote Thar sand dunes, explore the living Jaisalmer Fort, and discover secret desert hamlets.",
      fullDescription: "From the majestic blue alleyways of Mehrangarh in Jodhpur to the golden sandstone walls of Jaisalmer, this expedition dives deep into the royal folklore, nomadic music, and raw desert beauty of Rajasthan. Sleep under a billion stars on private non-touristy sand dunes in Sam, enjoy authentic Rajasthani Dal Baati Churma, and explore abandoned ghost villages like Kuldhara.",
      coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "Sleep on secluded golden sand dunes under open galaxy skies",
        "Sunset camel safari and dune bashing in 4x4 open jeeps",
        "Heritage walking tour inside the world's only living golden fort in Jaisalmer",
        "Explore the haunted 300-year-old abandoned ghost ruins of Kuldhara",
        "Live Manganiyar folk musicians & Kalbeliya fire dancers around desert bonfire",
        "Authentic royal Rajasthani banquet dinner with Ker Sangri & Laal Maas"
      ]),
      inclusions: JSON.stringify([
        "4 Nights accommodation (Heritage Haveli in Jaisalmer & Swiss Desert Tents with private bathrooms)",
        "Daily Breakfast and Royal Rajasthani Dinners",
        "Private AC transport from Jodhpur to Jodhpur across all 5 days",
        "Camel safari, 4x4 dune bashing session, and cultural folk performance",
        "Wandermate Experience Lead & native historian guide"
      ]),
      exclusions: JSON.stringify([
        "Lunches and street food tours",
        "Monument camera tickets",
        "Personal shopping and gratuities"
      ]),
      faqs: JSON.stringify([
        { question: "Is desert camping safe and comfortable?", answer: "Absolutely! We partner with premium eco-desert camps featuring luxury swiss tents, attached modern bathrooms with hot water, and 24/7 security." }
      ]),
      importantInfo: "Winter in Rajasthan brings warm sunny days (24°C) and chilly desert nights (10°C). Bring both light cottons and a warm jacket.",
      status: "ACTIVE",
      featured: false,
      itinerary: [
        { day: 1, title: "Arrive in the Blue City Jodhpur", description: "Meet at Jodhpur. Check into our heritage haveli, visit the towering Mehrangarh Fort, and stroll through the indigo alleyways of the old blue city.", meals: "Dinner", stay: "Heritage Haveli Jodhpur" },
        { day: 2, title: "Jodhpur to Jaisalmer via Osian Desert Temple", description: "Drive into the heart of Thar. Stop at ancient Osian stepwells. Arrive in the golden city of Jaisalmer and watch sunset over Gadisar Lake.", meals: "Breakfast, Dinner", stay: "Sandstone Haveli Jaisalmer" },
        { day: 3, title: "Jaisalmer Living Fort & Thar Desert Camp", description: "Explore the living golden fort and Patwon ki Haveli. Head into the deep Thar desert for sunset camel rides, dune bashing, and a magical night of folk music under the stars.", meals: "Breakfast, Dinner", stay: "Luxury Swiss Desert Camp" },
        { day: 4, title: "Haunted Kuldhara Village & Tanot Border Trail", description: "Visit the eerie ruins of Kuldhara village and the historic Tanot Mata temple near the Indo-Pak border. Evening bonfire and stargazing.", meals: "Breakfast, Dinner", stay: "Desert Resort / Haveli" },
        { day: 5, title: "Return to Jodhpur & Farewell", description: "Morning breakfast and drive back to Jodhpur railway station / airport for onward departures.", meals: "Breakfast", stay: "Departure" }
      ]
    },
    {
      title: "Kerala Backwaters & Western Ghats Trail — 6 Days",
      slug: "kerala-backwaters-and-western-ghats-trail-6-days",
      destination: "Munnar, Thekkady & Alleppey, Kerala",
      category: "Backpacking",
      duration: "6 Days / 5 Nights",
      price: 16499,
      originalPrice: 20499,
      startingLocation: "Kochi",
      endingLocation: "Kochi",
      availableSeats: 12,
      dates: JSON.stringify(["10 Oct 2026", "05 Nov 2026", "01 Dec 2026", "15 Dec 2026"]),
      shortDescription: "Trek through misty high-altitude tea estates in Munnar, bamboo raft with wild elephants in Periyar, and cruise serene emerald backwaters in Alleppey.",
      fullDescription: "Immerse in God's Own Country with Wandermate Traverse. We leave commercial tourist buses behind to trek remote mountain ridges in Munnar, take private wooden canoe rides through secret village backwater canals, and feast on traditional Kerala Sadya served on fresh banana leaves.",
      coverImage: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "Sunrise hike to Kolukkumalai — the World's Highest Organic Tea Plantation (7,900 ft)",
        "Overnight stay on a traditional Kerala houseboat cruising through backwater canals",
        "Bamboo rafting and spice plantation trek in Periyar Tiger Reserve",
        "Private canoe exploration of narrow village backwater channels",
        "Authentic Kalaripayattu martial arts and Kathakali performance",
        "Feast on authentic Kerala Sadya and fresh Malabar coastal delicacies"
      ]),
      inclusions: JSON.stringify([
        "5 Nights accommodation (Tea Estate Chalets, Spice Plantation Homestays & Backwater Houseboat)",
        "Daily Breakfast and authentic Kerala Dinners",
        "All internal AC transportation from Kochi to Kochi",
        "Kolukkumalai 4x4 Jeep Safari, Houseboat Cruise & Canoe tour",
        "Wandermate Trip Leader & local naturalist"
      ]),
      exclusions: JSON.stringify([
        "Flights to/from Kochi",
        "Lunches and personal shopping"
      ]),
      faqs: JSON.stringify([
        { question: "Is this trip suitable for solo travelers?", answer: "Yes! 70% of our Wandermate travelers join solo. You will be paired with same-gender roommates or can request private occupancy." }
      ]),
      importantInfo: "Bring insect repellent, comfortable walking shoes, light rain jacket, and camera.",
      status: "ACTIVE",
      featured: false,
      itinerary: [
        { day: 1, title: "Kochi to Munnar via Cheeyappara Waterfalls", description: "Meet in historic Fort Kochi. Drive up into the lush Western Ghats passing gushing waterfalls and cardamom plantations. Check into our hillside estate.", meals: "Dinner", stay: "Munnar Tea Estate Lodge" },
        { day: 2, title: "Highest Tea Plantation Kolukkumalai & Top Station", description: "Early morning 4x4 jeep ride to Kolukkumalai for an ethereal cloud-inversion sunrise. Walk through century-old tea factories and taste single-estate orthodox teas.", meals: "Breakfast, Dinner", stay: "Munnar Tea Estate Lodge" },
        { day: 3, title: "Munnar to Thekkady Spice Sanctuary", description: "Drive to Thekkady. Guided walking tour through aromatic cardamom, cinnamon, and pepper plantations. Evening live Kalaripayattu demonstration.", meals: "Breakfast, Dinner", stay: "Thekkady Nature Retreat" },
        { day: 4, title: "Thekkady to Alleppey Houseboat Cruise", description: "Head down to the enchanting backwaters of Alleppey. Board our private traditional Kettuvallam houseboat. Cruise through lush paddy fields and serene lagoons.", meals: "Breakfast, Lunch, Dinner", stay: "Deluxe Alleppey Houseboat" },
        { day: 5, title: "Secret Canoe Trails & Marari Beach Sunset", description: "Hop into silent village canoes to explore quiet backwater channels where large boats cannot reach. Sunset stroll on secluded Marari beach.", meals: "Breakfast, Dinner", stay: "Marari Beach Resort" },
        { day: 6, title: "Return to Kochi & Historic Fort Kochi Walk", description: "Morning walk by the Chinese fishing nets in Fort Kochi before airport drop-offs.", meals: "Breakfast", stay: "Departure" }
      ]
    },
    {
      title: "Vietnam & Ha Long Bay Explorer — 7 Days",
      slug: "vietnam-and-ha-long-bay-explorer-7-days",
      destination: "Hanoi, Ninh Binh & Ha Long Bay, Vietnam",
      category: "Expedition",
      duration: "7 Days / 6 Nights",
      price: 42999,
      originalPrice: 49999,
      startingLocation: "Hanoi (HAN)",
      endingLocation: "Hanoi (HAN)",
      availableSeats: 10,
      dates: JSON.stringify(["18 Oct 2026", "14 Nov 2026", "08 Dec 2026", "10 Jan 2027"]),
      shortDescription: "Cruise emerald limestone karsts on Ha Long Bay, cycle through Ninh Binh's rice paddies, and explore the bustling French Quarter and street food of Hanoi.",
      fullDescription: "Venture across northern Vietnam with Wandermate Traverse. From the buzzing motorcycle-filled lanes of Hanoi's Old Quarter with world-famous egg coffee, to gliding between towering limestone monoliths on a luxury Ha Long Bay overnight cruise, this journey blends culture, untamed landscapes, and unforgettable culinary adventures.",
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      ]),
      highlights: JSON.stringify([
        "5-Star Overnight Cruise through the mystical limestone towers of Ha Long & Lan Ha Bay",
        "Kayaking through hidden sea caves and swimming in secluded emerald lagoons",
        "Rowboat expedition through Tam Coc and Trang An grottoes in Ninh Binh",
        "Hike 500 stone steps up Dragon Peak at Mua Caves for panoramic valley vistas",
        "Curated Hanoi Old Quarter street food safari (Pho, Banh Mi, Bun Cha & Egg Coffee)",
        "Scenic countryside cycling tour through lotus fields and rustic Vietnamese villages"
      ]),
      inclusions: JSON.stringify([
        "6 Nights accommodation (Boutique Hanoi Old Quarter Hotels, Eco-resort in Ninh Binh & Luxury Ha Long Cruise Cabin)",
        "Daily Breakfast, 2 Lunches on Cruise, and Special Welcome & Farewell Dinners",
        "All inter-city VIP Limousine transfers within Vietnam",
        "Ha Long Bay Cruise with all activities (kayaking, squid fishing, cooking class)",
        "Wandermate International Trip Leader & English-speaking Vietnamese Guide",
        "All entrance tickets and boat fees"
      ]),
      exclusions: JSON.stringify([
        "International flights to/from Hanoi",
        "Vietnam e-Visa fees (approx $25)",
        "Lunches/Dinners not specified in inclusions",
        "Personal shopping and travel insurance"
      ]),
      faqs: JSON.stringify([
        { question: "Do Indians require a visa for Vietnam?", answer: "Yes, Indians can easily apply for a simple 30-day single entry e-Visa online in 3 working days." }
      ]),
      importantInfo: "Passport must have at least 6 months validity from the date of travel.",
      status: "ACTIVE",
      featured: true,
      itinerary: [
        { day: 1, title: "Welcome to Hanoi — The Soul of Vietnam", description: "Arrive at Noi Bai International Airport in Hanoi. Transfer to our boutique hotel in the historic Old Quarter. Evening guided walking tour and welcome Pho & Egg coffee.", meals: "Dinner", stay: "Old Quarter Boutique Hotel" },
        { day: 2, title: "Hanoi Cultural Heart & Train Street", description: "Explore the Temple of Literature, Tran Quoc Pagoda by West Lake, and experience the adrenaline of the famous Hanoi Train Street. Evening street food crawl.", meals: "Breakfast, Dinner", stay: "Old Quarter Boutique Hotel" },
        { day: 3, title: "Hanoi to Ninh Binh — Ha Long Bay on Land", description: "Drive to stunning Ninh Binh. Take a serene sampan boat ride along the Ngo Dong River through limestone water caves. Cycle through lush rural villages.", meals: "Breakfast, Lunch, Dinner", stay: "Ninh Binh Eco Valley Resort" },
        { day: 4, title: "Hang Mua Dragon Peak & Drive to Ha Long Bay", description: "Hike up the 500 steps of Mua Cave mountain for 360-degree views over karst valleys. Transfer to the coast and board our luxury cruise liner on Ha Long Bay.", meals: "Breakfast, Lunch, Dinner", stay: "Luxury Ha Long Bay Cruise Ship" },
        { day: 5, title: "Ha Long Bay Sunrise Tai Chi & Kayaking", description: "Morning Tai Chi on the cruise sundeck as mist clears over emerald waters. Kayak through Bright & Dark water caves and swim in secluded beaches.", meals: "Breakfast, Lunch, Dinner", stay: "Luxury Ha Long Bay Cruise Ship" },
        { day: 6, title: "Ha Long Bay to Hanoi Farewell Night", description: "Final scenic cruise brunch. Disembark and transfer back to Hanoi. Free afternoon for lacquerware and coffee shopping, followed by a celebratory farewell dinner.", meals: "Breakfast, Dinner", stay: "Old Quarter Boutique Hotel" },
        { day: 7, title: "Depart from Hanoi with Lifelong Memories", description: "Enjoy a leisurely morning in Hanoi before private transfer to the airport for your flight home.", meals: "Breakfast", stay: "Departure" }
      ]
    }
  ];

  for (const t of tripsData) {
    const { itinerary, ...tripData } = t;
    const createdTrip = await prisma.trip.create({
      data: {
        ...tripData,
      },
    });

    for (const item of itinerary) {
      await prisma.itineraryItem.create({
        data: {
          tripId: createdTrip.id,
          day: item.day,
          title: item.title,
          description: item.description,
          meals: item.meals,
          stay: item.stay,
        },
      });
    }
    console.log("Created trip:", createdTrip.title);
  }

  // 6. Sample Gallery Images
  const galleryPhotos = [
    {
      title: "Key Gompa Morning Glow",
      category: "Mountains",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Alpine Camp under Milky Way",
      category: "Mountains",
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 2,
    },
    {
      title: "Turquoise Pools of Meghalaya",
      category: "Caves & Waterfalls",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 3,
    },
    {
      title: "Ha Long Bay Karst Monoliths",
      category: "Expeditions",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 4,
    },
    {
      title: "Emerald Kerala Backwaters",
      category: "Backpacking",
      imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 5,
    },
    {
      title: "Thar Desert Sunset Dunes",
      category: "Culture & Deserts",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      sortOrder: 6,
    },
  ];

  for (const img of galleryPhotos) {
    await prisma.galleryImage.create({
      data: img,
    });
  }
  console.log("Created gallery images");

  // 7. Sample Initial Bookings for Admin Dashboard
  const firstTrip = await prisma.trip.findFirst();
  if (firstTrip) {
    await prisma.booking.createMany({
      data: [
        {
          bookingId: "WT-2026-8941",
          tripId: firstTrip.id,
          tripTitle: firstTrip.title,
          customerName: "Rohan Sharma",
          email: "rohan.travels@gmail.com",
          phone: "9820199882",
          travelers: 2,
          date: "15 Oct 2026",
          specialRequests: "We are pure vegetarians. Please ensure jain/veg meal options.",
          totalPrice: firstTrip.price * 2,
          status: "CONFIRMED",
        },
        {
          bookingId: "WT-2026-9104",
          tripId: firstTrip.id,
          tripTitle: firstTrip.title,
          customerName: "Ananya Deshmukh",
          email: "ananya.d@outlook.com",
          phone: "9876543210",
          travelers: 1,
          date: "28 Oct 2026",
          specialRequests: "Solo female traveler. Excited for astrophotography!",
          totalPrice: firstTrip.price,
          status: "PENDING",
        },
      ],
    });
    console.log("Created sample bookings");
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

