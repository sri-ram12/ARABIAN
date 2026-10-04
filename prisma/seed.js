const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Arabian Mandi Database ---');

  // Clear existing data in correct dependency order
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.deliveryLocation.deleteMany();
  await prisma.deliveryAssignment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemAddon.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();

  console.log('Cleared existing data.');

  // 1. Restaurant Settings
  const restaurant = await prisma.restaurant.create({
    data: {
      id: 'arabian-mandi-main',
      name: 'Arabian Mandi',
      tagline: 'Authentic Arabian Flavours Delivered Across Thagarapuvalasa',
      description: 'Experience the royal heritage of Yemeni and Middle Eastern culinary craft. Smoked fragrant basmati rice with toasted nuts and golden raisins, slow-roasted succulent meats, authentic toum & fiery shatta.',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      address: 'NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162',
      latitude: 17.9288,
      longitude: 83.4350,
      phone: '+91 89192 34567',
      email: 'orders@arabianmandi.in',
      openingHours: '11:00 AM',
      closingHours: '11:30 PM',
      isOpen: true,
      deliveryRadiusKm: 15.0,
      minOrderAmount: 200.0,
      baseDeliveryFee: 35.0,
      freeDeliveryThreshold: 599.0,
      taxPercentage: 5.0, // 5% GST
      packagingFee: 25.0,
      codEnabled: true,
      cancellationAllowedMinutes: 5,
      estimatedPrepTimeMin: 25,
    },
  });
  console.log('Created Restaurant:', restaurant.name);

  // 2. Users
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const kitchenHash = await bcrypt.hash('Kitchen@123', 10);
  const riderHash = await bcrypt.hash('Rider@123', 10);
  const customerHash = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Restaurant Admin',
      email: 'admin@arabianmandi.in',
      phone: '9876543210',
      password: passwordHash,
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      name: 'Master Chef Tariq',
      email: 'kitchen@arabianmandi.in',
      phone: '9876543211',
      password: kitchenHash,
      role: 'KITCHEN_STAFF',
      profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
    },
  });

  const rider1 = await prisma.user.create({
    data: {
      name: 'Raju (Delivery Partner)',
      email: 'rider1@arabianmandi.in',
      phone: '9876543212',
      password: riderHash,
      role: 'DELIVERY_PARTNER',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const rider2 = await prisma.user.create({
    data: {
      name: 'Suresh (Delivery Partner)',
      email: 'rider2@arabianmandi.in',
      phone: '9876543213',
      password: riderHash,
      role: 'DELIVERY_PARTNER',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const rider3 = await prisma.user.create({
    data: {
      name: 'Anil (Delivery Partner)',
      email: 'rider3@arabianmandi.in',
      phone: '9876543214',
      password: riderHash,
      role: 'DELIVERY_PARTNER',
      profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Karthik Verma',
      email: 'customer@arabianmandi.in',
      phone: '9876543215',
      password: customerHash,
      role: 'CUSTOMER',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
  });

  console.log('Created Users: Admin, Kitchen, 3 Delivery Partners, Customer.');

  // 3. Customer Address in Thagarapuvalasa
  const address1 = await prisma.address.create({
    data: {
      userId: customer.id,
      addressLine: 'Flat 302, Royal Residency, Beside NRI Hospital Road',
      landmark: 'Near Sangivalasa Arch',
      area: 'Sangivalasa',
      city: 'Thagarapuvalasa',
      state: 'Andhra Pradesh',
      pincode: '531162',
      latitude: 17.9250,
      longitude: 83.4385,
      addressType: 'HOME',
      deliveryInstructions: 'Ring doorbell twice. Flat is on 3rd floor.',
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer.id,
      addressLine: 'Chittivalasa Jute Mill Quarters, Main Bazaar',
      landmark: 'Opposite State Bank of India',
      area: 'Chittivalasa',
      city: 'Thagarapuvalasa',
      state: 'Andhra Pradesh',
      pincode: '531162',
      latitude: 17.9355,
      longitude: 83.4312,
      addressType: 'WORK',
      deliveryInstructions: 'Call upon arrival at main gate',
      isDefault: false,
    },
  });

  // 4. Delivery Zones in & around Thagarapuvalasa
  await prisma.deliveryZone.createMany({
    data: [
      {
        name: 'Zone A - Thagarapuvalasa & Sangivalasa',
        minDistanceKm: 0.0,
        maxDistanceKm: 3.5,
        deliveryFee: 30.0,
        estimatedTimeMin: 30,
        isActive: true,
      },
      {
        name: 'Zone B - Chittivalasa & Anandapuram NH16',
        minDistanceKm: 3.5,
        maxDistanceKm: 8.0,
        deliveryFee: 50.0,
        estimatedTimeMin: 40,
        isActive: true,
      },
      {
        name: 'Zone C - Bheemunipatnam (Bheemili) & Beach Road',
        minDistanceKm: 8.0,
        maxDistanceKm: 15.0,
        deliveryFee: 80.0,
        estimatedTimeMin: 55,
        isActive: true,
      },
    ],
  });

  // 5. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME50',
        title: 'Flat ₹50 OFF',
        description: 'Get ₹50 off on your first authentic Arabian Mandi order',
        discountType: 'FLAT',
        discountValue: 50.0,
        minOrderAmount: 299.0,
        isActive: true,
      },
      {
        code: 'MANDI100',
        title: 'Flat ₹100 OFF',
        description: 'Flat ₹100 discount on hearty Mandi platters above ₹699',
        discountType: 'FLAT',
        discountValue: 100.0,
        minOrderAmount: 699.0,
        isActive: true,
      },
      {
        code: 'FESTIVE15',
        title: '15% Festive Discount',
        description: '15% discount on all Arabian specialties up to ₹150',
        discountType: 'PERCENTAGE',
        discountValue: 15.0,
        minOrderAmount: 499.0,
        maxDiscount: 150.0,
        isActive: true,
      },
      {
        code: 'SULTAN20',
        title: '20% Sultan Family Feast',
        description: '20% off on large family mandi combos up to ₹250',
        discountType: 'PERCENTAGE',
        discountValue: 20.0,
        minOrderAmount: 999.0,
        maxDiscount: 250.0,
        isActive: true,
      },
      {
        code: 'FREEDEL',
        title: 'Free Delivery',
        description: 'Enjoy zero delivery fees on orders above ₹399',
        discountType: 'FLAT',
        discountValue: 40.0,
        minOrderAmount: 399.0,
        isActive: true,
      },
    ],
  });

  // 6. Categories (11 authentic categories)
  const categoriesData = [
    {
      name: 'Arabian Mandi',
      slug: 'arabian-mandi',
      description: 'Signature smoked fragrant basmati rice dishes with succulent slow-roasted meats',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Chicken Starters & Kebabs',
      slug: 'chicken-starters',
      description: 'Charcoal charred kebabs, skewers, and crisp starters infused with Middle Eastern spices',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Mutton Delicacies',
      slug: 'mutton-delicacies',
      description: 'Slow-braised tender lamb and mutton specialties prepared in Yemeni tradition',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Seafood Specials',
      slug: 'seafood-specials',
      description: 'Fresh local coastal fish and prawns grilled with Arabic marinades',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=600&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Biryani & Rice',
      slug: 'biryani-rice',
      description: 'Dum-cooked aromatic basmati rice infused with saffron, ghee, and roasted spices',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop',
      displayOrder: 5,
    },
    {
      name: 'Vegetarian Delights',
      slug: 'vegetarian-delights',
      description: 'Exquisite paneer, mushroom, and spiced vegetable Arabian creations',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
      displayOrder: 6,
    },
    {
      name: 'Fresh Breads & Khubz',
      slug: 'breads-khubz',
      description: 'Clay-oven baked rumali rotis, Middle Eastern khubz, and butter naans',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop',
      displayOrder: 7,
    },
    {
      name: 'Soups & Salads',
      slug: 'soups-salads',
      description: 'Hearty bone broths, marags, and fresh crisp Mediterranean salads',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop',
      displayOrder: 8,
    },
    {
      name: 'Royal Desserts',
      slug: 'desserts',
      description: 'Warm cheese kunafa, flaky baklava, and Hyderabadi apricot delights',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600&auto=format&fit=crop',
      displayOrder: 9,
    },
    {
      name: 'Refreshing Beverages',
      slug: 'beverages',
      description: 'Saudi champagne, fresh mint coolers, and rich dry fruit shakes',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop',
      displayOrder: 10,
    },
    {
      name: 'Family Feasts & Combos',
      slug: 'combos-feasts',
      description: 'Grand platters designed for family gatherings, celebrations, and groups',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
      displayOrder: 11,
    },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }
  console.log(`Created ${categoriesData.length} categories.`);

  // 7. Menu Items (32 items)
  const menuItemsData = [
    // Arabian Mandi
    {
      categoryId: catMap['arabian-mandi'],
      name: 'Faham Chicken Mandi',
      slug: 'faham-chicken-mandi',
      description: 'Smoked whole chicken leg roasted over charcoal coals with Yemeni hawaij spices, served on aromatic basmati mandi rice topped with fried onions, toasted cashews & raisins. Accompanied by spicy dakkoos and garlic toum.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=700&auto=format&fit=crop',
      price: 360.0,
      discountedPrice: 329.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
      ingredients: 'Chicken, Aromatic Basmati, Hawaij Spice Mix, Garlic, Ghee, Almonds, Cashews, Raisins',
      sizesJson: JSON.stringify([
        { name: 'Half (Serves 1-2)', price: 329 },
        { name: 'Full (Serves 2-3)', price: 599 },
        { name: 'Family Pack (Serves 4-5)', price: 999 }
      ]),
    },
    {
      categoryId: catMap['arabian-mandi'],
      name: 'Arabian Mutton Juicy Mandi',
      slug: 'mutton-juicy-mandi',
      description: 'Tender baby goat ribs braised to melt-in-mouth perfection in aromatic spiced mutton stock, then finished with rich ghee over fragrant saffron mandi rice.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 520.0,
      discountedPrice: 489.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 30,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_2_3',
      servesCount: 2,
      ingredients: 'Prime Lamb, Long Basmati Rice, Arabian Hawaij, Cardamom, Black Lime, Fried Onions, Dry Fruits',
      sizesJson: JSON.stringify([
        { name: 'Single (Serves 1)', price: 349 },
        { name: 'Medium (Serves 2-3)', price: 489 },
        { name: 'Jumbo Platter (Serves 4-5)', price: 1299 }
      ]),
    },
    {
      categoryId: catMap['arabian-mandi'],
      name: 'Crispy Broasted Chicken Mandi',
      slug: 'broasted-chicken-mandi',
      description: 'Golden crunchy pressure-fried Arabian style chicken with secret herbs, paired with our signature smoked mandi rice, garlic toum, and pickled chilies.',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=700&auto=format&fit=crop',
      price: 380.0,
      discountedPrice: 349.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
      ingredients: 'Fresh Chicken, Secret Spice Crust, Basmati Rice, Garlic Toum',
      sizesJson: JSON.stringify([
        { name: 'Half (Serves 1-2)', price: 349 },
        { name: 'Full (Serves 2-3)', price: 620 }
      ]),
    },
    {
      categoryId: catMap['arabian-mandi'],
      name: 'Arabian Special Fish Mandi',
      slug: 'fish-mandi',
      description: 'Fresh coastal seer fish steak marinated in Arabic lemon-coriander and sumac masala, pan-seared and laid over hot smoked mandi rice.',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=700&auto=format&fit=crop',
      price: 490.0,
      discountedPrice: 449.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
      ingredients: 'Coastal Seer Fish, Sumac, Lemon, Arabic Spices, Fragrant Basmati',
      sizesJson: JSON.stringify([
        { name: 'Regular (Serves 1-2)', price: 449 },
        { name: 'Large (Serves 2-3)', price: 799 }
      ]),
    },
    {
      categoryId: catMap['arabian-mandi'],
      name: 'Paneer Tikka Mandi',
      slug: 'paneer-tikka-mandi',
      description: 'Tender cottage cheese cubes marinated in saffron yogurt and tandoor-roasted, served over fragrant vegetarian mandi rice infused with cloves and cardamom.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=700&auto=format&fit=crop',
      price: 320.0,
      discountedPrice: 289.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
      ingredients: 'Fresh Paneer, Spices, Ghee, Saffron, Veg Mandi Basmati Rice',
      sizesJson: JSON.stringify([
        { name: 'Half (Serves 1-2)', price: 289 },
        { name: 'Full (Serves 2-3)', price: 499 }
      ]),
    },

    // Chicken Starters
    {
      categoryId: catMap['chicken-starters'],
      name: 'Shish Taouk Kebab',
      slug: 'shish-taouk',
      description: 'Boneless tender chicken cubes steeped in lemon juice, garlic, Turkish yogurt, and Arabian sumac, charcoal grilled on skewers.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=700&auto=format&fit=crop',
      price: 299.0,
      discountedPrice: 269.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['chicken-starters'],
      name: 'Chicken Al-Faham (Half)',
      slug: 'chicken-al-faham',
      description: 'Authentic Yemeni-style chicken marinated in crushed coriander seeds, black peppercorns, and cumin, barbecued over hot coal.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=700&auto=format&fit=crop',
      price: 280.0,
      discountedPrice: 250.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'SPICY',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['chicken-starters'],
      name: 'Arabian Chicken Majestic',
      slug: 'chicken-majestic',
      description: 'Crispy fried chicken strips tossed in a fragrant temper of curry leaves, green chilies, yogurt, and Middle Eastern spices.',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=700&auto=format&fit=crop',
      price: 270.0,
      discountedPrice: null,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 15,
      spiceLevel: 'SPICY',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['chicken-starters'],
      name: 'Spicy Arabian Wings (6 Pcs)',
      slug: 'arabian-wings',
      description: 'Crispy fried chicken wings tossed in a spicy-sweet chili garlic glaze dusted with sumac and toasted sesame.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=700&auto=format&fit=crop',
      price: 240.0,
      discountedPrice: 219.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 15,
      spiceLevel: 'SPICY',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },

    // Mutton Delicacies
    {
      categoryId: catMap['mutton-delicacies'],
      name: 'Mutton Seekh Kebab (4 Pcs)',
      slug: 'mutton-seekh-kebab',
      description: 'Finely minced tender lamb combined with roasted cumin, mint, green chilies, and coriander, skewered and charcoal grilled.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 360.0,
      discountedPrice: 329.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['mutton-delicacies'],
      name: 'Mutton Ghee Roast',
      slug: 'mutton-ghee-roast',
      description: 'Boneless tender goat meat slow-roasted in pure ghee with freshly ground fiery Byadgi chilies and aromatic spices.',
      image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=700&auto=format&fit=crop',
      price: 420.0,
      discountedPrice: 399.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'EXTRA_SPICY',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },

    // Seafood Specials
    {
      categoryId: catMap['seafood-specials'],
      name: 'Apollo Fish',
      slug: 'apollo-fish',
      description: 'Boneless coastal fish cubes tossed in spicy yogurt batter with curry leaves and green chilies.',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=700&auto=format&fit=crop',
      price: 340.0,
      discountedPrice: 310.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 15,
      spiceLevel: 'SPICY',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['seafood-specials'],
      name: 'Tandoori Jumbo Prawns (6 Pcs)',
      slug: 'tandoori-prawns',
      description: 'Fresh jumbo Bay of Bengal prawns marinated in crushed ajwain, tandoori masala, and mustard oil, clay roasted.',
      image: 'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=700&auto=format&fit=crop',
      price: 420.0,
      discountedPrice: 389.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },

    // Biryani & Rice
    {
      categoryId: catMap['biryani-rice'],
      name: 'Special Chicken Dum Biryani',
      slug: 'special-chicken-dum-biryani',
      description: 'Traditional slow dum-cooked long-grain basmati with succulent chicken, saffron milk, fried onions, and whole spices. Served with Mirchi ka Salan & Raita.',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=700&auto=format&fit=crop',
      price: 290.0,
      discountedPrice: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['biryani-rice'],
      name: 'Mutton Dum Biryani',
      slug: 'mutton-dum-biryani',
      description: 'Kachhi style slow-cooked goat meat layered between fragrant basmati rice infused with rose water, mint, and pure ghee.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=700&auto=format&fit=crop',
      price: 390.0,
      discountedPrice: 360.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },

    // Breads
    {
      categoryId: catMap['breads-khubz'],
      name: 'Arabian Khubz / Pita (2 Pcs)',
      slug: 'arabian-khubz',
      description: 'Soft authentic Middle Eastern pocket flatbread baked fresh, perfect for scooping up kebabs and garlic toum.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=700&auto=format&fit=crop',
      price: 50.0,
      discountedPrice: null,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 10,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },
    {
      categoryId: catMap['breads-khubz'],
      name: 'Butter Naan',
      slug: 'butter-naan',
      description: 'Classic clay oven roasted leavened bread generously brushed with fresh butter.',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=700&auto=format&fit=crop',
      price: 45.0,
      discountedPrice: null,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 10,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },
    {
      categoryId: catMap['breads-khubz'],
      name: 'Garlic Coriander Naan',
      slug: 'garlic-naan',
      description: 'Clay oven flatbread infused with roasted minced garlic and fresh coriander leaves.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=700&auto=format&fit=crop',
      price: 60.0,
      discountedPrice: null,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 10,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },

    // Soups & Salads
    {
      categoryId: catMap['soups-salads'],
      name: 'Arabian Mutton Marag Broth',
      slug: 'mutton-marag',
      description: 'Royal spicy mutton bone soup slow-simmered with cashews, almonds, and cracked black pepper. A classic Hyderabadi-Arabian starter.',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=700&auto=format&fit=crop',
      price: 199.0,
      discountedPrice: 179.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 15,
      spiceLevel: 'SPICY',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },
    {
      categoryId: catMap['soups-salads'],
      name: 'Fattoush Salad with Crispy Khubz',
      slug: 'fattoush-salad',
      description: 'Refreshing Middle Eastern chopped salad with cucumbers, tomatoes, radishes, pomegranate, and crisp toasted pita chips in sumac-lemon dressing.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=700&auto=format&fit=crop',
      price: 160.0,
      discountedPrice: 140.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 10,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },

    // Desserts
    {
      categoryId: catMap['desserts'],
      name: 'Royal Cheese Kunafa',
      slug: 'royal-cheese-kunafa',
      description: 'Crisp golden kataifi vermicelli crust stuffed with stretchy hot sweet cheese, soaked in fragrant orange blossom syrup and smothered with crushed pistachios.',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=700&auto=format&fit=crop',
      price: 280.0,
      discountedPrice: 249.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 15,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['desserts'],
      name: 'Baklava Assortment (4 Pcs)',
      slug: 'baklava-assortment',
      description: 'Flaky layers of buttery phyllo pastry filled with crushed walnuts and pistachios, drenched in honey syrup.',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=700&auto=format&fit=crop',
      price: 220.0,
      discountedPrice: null,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 5,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1_2',
      servesCount: 2,
    },
    {
      categoryId: catMap['desserts'],
      name: 'Apricot Delight (Khubani Ka Meetha)',
      slug: 'apricot-delight',
      description: 'Traditional slow-cooked dried apricots served warm with chilled rich custard cream and crushed almonds.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=700&auto=format&fit=crop',
      price: 180.0,
      discountedPrice: 159.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 5,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },

    // Beverages
    {
      categoryId: catMap['beverages'],
      name: 'Arabian Mint Lime Cooler',
      slug: 'mint-lime-cooler',
      description: 'Hand-crushed fresh garden mint, tangy lemon juice, and sparkling soda with a pinch of rock salt.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=700&auto=format&fit=crop',
      price: 90.0,
      discountedPrice: 79.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 5,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },
    {
      categoryId: catMap['beverages'],
      name: 'Saudi Champagne (Pitcher)',
      slug: 'saudi-champagne',
      description: 'Refreshing Middle Eastern mocktail made with chilled sparkling apple juice, sliced fresh oranges, lemons, and aromatic mint leaves.',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=700&auto=format&fit=crop',
      price: 180.0,
      discountedPrice: 160.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMin: 5,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_2_3',
      servesCount: 3,
    },
    {
      categoryId: catMap['beverages'],
      name: 'Royal Dates & Almond Milkshake',
      slug: 'dates-almond-shake',
      description: 'Rich creamy shake blended with soft Arabian medjool dates, roasted almonds, pure honey, and a touch of saffron.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=700&auto=format&fit=crop',
      price: 160.0,
      discountedPrice: 140.0,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 5,
      spiceLevel: 'MILD',
      servingSize: 'SERVES_1',
      servesCount: 1,
    },

    // Combos & Family Feasts
    {
      categoryId: catMap['combos-feasts'],
      name: 'Sultan Feasting Platter (Serves 4)',
      slug: 'sultan-feasting-platter',
      description: 'Grand communal Mandi platter with 2 pieces Faham Chicken, tender braised Mutton Juicy, 4 Shish Taouk kebabs, fragrant basmati rice, dakkoos, toum & 2 Mint Lime Coolers.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=700&auto=format&fit=crop',
      price: 1499.0,
      discountedPrice: 1299.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 35,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_4_6',
      servesCount: 4,
    },
    {
      categoryId: catMap['combos-feasts'],
      name: 'Arabian Sheikh Mandi Feast (Serves 6)',
      slug: 'sheikh-mandi-feast',
      description: 'The ultimate royal banquet: Full Faham Chicken Mandi + Full Mutton Juicy Mandi + Mixed Kebab Starter Platter + 1 Cheese Kunafa + Pitcher of Saudi Champagne.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 2499.0,
      discountedPrice: 2199.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMin: 40,
      spiceLevel: 'MEDIUM',
      servingSize: 'SERVES_4_6',
      servesCount: 6,
    }
  ];

  const createdItems = [];
  for (const item of menuItemsData) {
    const created = await prisma.menuItem.create({ data: item });
    createdItems.push(created);
  }
  console.log(`Created ${createdItems.length} menu items.`);

  // 8. Addons for Mandi Items
  const fahamItem = createdItems.find(i => i.slug === 'faham-chicken-mandi');
  const muttonItem = createdItems.find(i => i.slug === 'mutton-juicy-mandi');
  const broastedItem = createdItems.find(i => i.slug === 'broasted-chicken-mandi');

  const mandiAddons = [
    { name: 'Extra Faham Chicken Piece', price: 180.0 },
    { name: 'Extra Mandi Rice Portion', price: 120.0 },
    { name: 'Authentic Toum Garlic Dip (100ml)', price: 40.0 },
    { name: 'Fiery Dakkoos / Shatta Sauce', price: 30.0 },
    { name: 'Toasted Almonds, Cashews & Raisins Garnish', price: 50.0 },
    { name: 'Mixed Vegetable Raita', price: 35.0 },
    { name: 'Thums Up (750ml Pet Bottle)', price: 45.0 },
  ];

  for (const mItem of [fahamItem, muttonItem, broastedItem].filter(Boolean)) {
    for (const addon of mandiAddons) {
      await prisma.menuItemAddon.create({
        data: {
          menuItemId: mItem.id,
          name: addon.name,
          price: addon.price,
          isAvailable: true,
        },
      });
    }
  }

  // Addons for Mutton
  if (muttonItem) {
    await prisma.menuItemAddon.create({
      data: {
        menuItemId: muttonItem.id,
        name: 'Extra Juicy Mutton Shank Piece',
        price: 240.0,
        isAvailable: true,
      },
    });
  }

  console.log('Created Add-ons for signature Mandi items.');

  // 9. Sample Active Order for Real-Time Tracking Demo
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'AM-20261004-001',
      customerId: customer.id,
      addressId: address1.id,
      status: 'OUT_FOR_DELIVERY',
      subtotal: 678.0,
      discount: 50.0,
      deliveryFee: 30.0,
      tax: 31.4,
      packagingFee: 25.0,
      totalAmount: 714.4,
      appliedCoupon: 'WELCOME50',
      deliveryInstructions: 'Ring doorbell twice. Flat is on 3rd floor.',
      kitchenNotes: 'Medium spicy, extra toum sauce please',
      deliveryOtp: '4821',
      estimatedDeliveryMin: 35,
    },
  });

  // Order Items
  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder.id,
      menuItemId: fahamItem.id,
      name: 'Faham Chicken Mandi (Half)',
      size: 'Half (Serves 1-2)',
      price: 329.0,
      quantity: 1,
      addOnsJson: JSON.stringify([{ name: 'Authentic Toum Garlic Dip (100ml)', price: 40 }]),
      subtotal: 369.0,
    },
  });

  const kunafaItem = createdItems.find(i => i.slug === 'royal-cheese-kunafa');
  if (kunafaItem) {
    await prisma.orderItem.create({
      data: {
        orderId: sampleOrder.id,
        menuItemId: kunafaItem.id,
        name: 'Royal Cheese Kunafa',
        size: 'Standard',
        price: 249.0,
        quantity: 1,
        addOnsJson: null,
        subtotal: 249.0,
      },
    });
  }

  // Payment for sample order
  await prisma.payment.create({
    data: {
      orderId: sampleOrder.id,
      paymentMethod: 'RAZORPAY',
      status: 'PAID',
      amount: 714.4,
      razorpayOrderId: 'order_test_99214710',
      razorpayPaymentId: 'pay_test_99214710_success',
      razorpaySignature: 'sig_mock_verified_signature_production',
      paidAt: new Date(),
    },
  });

  // Delivery Assignment to Rider 1
  await prisma.deliveryAssignment.create({
    data: {
      orderId: sampleOrder.id,
      deliveryPartnerId: rider1.id,
      status: 'PICKED_UP',
      earnings: 65.0,
      distanceKm: 3.2,
      acceptedAt: new Date(Date.now() - 15 * 60 * 1000),
      pickedUpAt: new Date(Date.now() - 5 * 60 * 1000),
      notes: 'Customer requested fast delivery',
    },
  });

  // Live Location of Rider 1 (on NH16 approaching Sangivalasa)
  await prisma.deliveryLocation.create({
    data: {
      deliveryPartnerId: rider1.id,
      orderId: sampleOrder.id,
      latitude: 17.9272,
      longitude: 83.4368,
      heading: 145.0,
      speed: 28.5,
    },
  });

  // 10. Sample Completed Order with Review
  const completedOrder = await prisma.order.create({
    data: {
      orderNumber: 'AM-20261003-098',
      customerId: customer.id,
      addressId: address1.id,
      status: 'DELIVERED',
      subtotal: 489.0,
      discount: 0.0,
      deliveryFee: 30.0,
      tax: 24.45,
      packagingFee: 25.0,
      totalAmount: 568.45,
      deliveryOtp: '7192',
      estimatedDeliveryMin: 35,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: completedOrder.id,
      paymentMethod: 'COD',
      status: 'PAID',
      amount: 568.45,
      paidAt: new Date(Date.now() - 24 * 3600 * 1000),
    },
  });

  await prisma.review.create({
    data: {
      orderId: completedOrder.id,
      userId: customer.id,
      rating: 5,
      foodRating: 5,
      deliveryRating: 5,
      comment: 'Best authentic Mandi in Thagarapuvalasa! The smoked basmati rice and fall-apart juicy mutton ribs were outstanding. Delivered piping hot.',
      isApproved: true,
    },
  });

  // Sample Support Ticket
  await prisma.supportTicket.create({
    data: {
      ticketId: 'TKT-10023',
      customerId: customer.id,
      orderId: completedOrder.id,
      issueType: 'FEEDBACK',
      subject: 'Compliment to the Chef',
      message: 'The garlic toum sauce tasted so genuine, reminded me of Jeddah! Keep it up.',
      status: 'RESOLVED',
      priority: 'LOW',
      adminNotes: 'Thanked the customer via SMS.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
