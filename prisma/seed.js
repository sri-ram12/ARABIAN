const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding S & H Arabian Mandi Database ---');

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

  // 1. Restaurant Settings for S & H Arabian Mandi
  const restaurant = await prisma.restaurant.create({
    data: {
      id: 'sh-arabian-mandi-main',
      name: 'S & H Arabian Mandi',
      tagline: 'Authentic Arabian Flavours Delivered Across Thagarapuvalasa',
      description: 'Experience the royal heritage of Yemeni and Gulf traditions at S & H Arabian Mandi. Smoked fragrant basmati rice with toasted nuts and golden raisins, fiery tandoori & juicy slow-roasted meats, handcrafted toum & fiery shatta.',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      address: 'NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162',
      latitude: 17.9288,
      longitude: 83.4350,
      phone: '+91 89192 34567',
      email: 'orders@sharabianmandi.in',
      openingHours: '11:00 AM',
      closingHours: '11:30 PM',
      isOpen: true,
      deliveryRadiusKm: 15.0,
      minOrderAmount: 200.0,
      baseDeliveryFee: 30.0,
      freeDeliveryThreshold: 599.0,
      taxPercentage: 5.0, // 5% GST
      packagingFee: 25.0,
      codEnabled: true,
      cancellationAllowedMinutes: 5,
      estimatedPrepTimeMin: 25,
    },
  });
  console.log('Created Restaurant:', restaurant.name);

  // 2. Users (Admin, Kitchen, Delivery Partners, Customer)
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const kitchenHash = await bcrypt.hash('Kitchen@123', 10);
  const riderHash = await bcrypt.hash('Rider@123', 10);
  const customerHash = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'S&H Admin',
      email: 'admin@arabianmandi.in',
      phone: '9876543210',
      password: passwordHash,
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      name: 'Chef Tariq (S&H Kitchen)',
      email: 'kitchen@arabianmandi.in',
      phone: '9876543211',
      password: kitchenHash,
      role: 'KITCHEN_STAFF',
      profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
    },
  });

  const rider1 = await prisma.user.create({
    data: {
      name: 'Raju (S&H Delivery Rider)',
      email: 'rider1@arabianmandi.in',
      phone: '9876543212',
      password: riderHash,
      role: 'DELIVERY_PARTNER',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const rider2 = await prisma.user.create({
    data: {
      name: 'Suresh (S&H Delivery Rider)',
      email: 'rider2@arabianmandi.in',
      phone: '9876543213',
      password: riderHash,
      role: 'DELIVERY_PARTNER',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
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

  console.log('Created Users.');

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

  // 4. Delivery Zones in Thagarapuvalasa
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
        description: 'Get ₹50 off on your first authentic S&H Arabian Mandi order',
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
        description: '15% discount on all S&H Arabian specialties up to ₹150',
        discountType: 'PERCENTAGE',
        discountValue: 15.0,
        minOrderAmount: 499.0,
        maxDiscount: 150.0,
        isActive: true,
      },
      {
        code: 'FREEDEL',
        title: 'Free Delivery',
        description: 'Enjoy zero delivery fees on orders above ₹399',
        discountType: 'FLAT',
        discountValue: 30.0,
        minOrderAmount: 399.0,
        isActive: true,
      },
    ],
  });

  // 6. Categories matching S & H Menu
  const categoriesData = [
    {
      name: 'Mandi Specials (Solo, Duo, Trio, Squad)',
      slug: 'mandi',
      description: 'Signature aromatic smoked basmati rice with tandoori, juicy, and kebab meats',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Non-Veg Starters',
      slug: 'non-veg-starters',
      description: 'Tangdi kebabs, crispy wings, chicken 65, tikkas, and apollo fish',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Veg Starters',
      slug: 'veg-starters',
      description: 'Paneer tikka, mushroom 65, paneer majestic, french fries & chilli egg',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Biryanis',
      slug: 'biryani',
      description: 'Slow-cooked fragrant basmati chicken dum, fry piece & joint biryani',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Desserts & Refreshers',
      slug: 'desserts-drinks',
      description: 'Warm cheese kunafa, fresh mint coolers, and authentic Arabian toum',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600&auto=format&fit=crop',
      displayOrder: 5,
    },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }
  console.log(`Created ${categoriesData.length} categories.`);

  // 7. S & H EXACT MANDI MENU ITEMS with Solo, Duo, Trio, Squad Portions
  const mandiItems = [
    {
      categoryId: catMap['mandi'],
      name: 'Tandoori Mandi',
      slug: 'tandoori-mandi',
      description: 'Clay-oven charcoal roasted spiced tandoori chicken served over aromatic smoked basmati mandi rice with fried onions, dry fruits, dakkoos & garlic toum.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=700&auto=format&fit=crop',
      price: 220.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'SPICY',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Tandoori Chicken, Basmati Rice, Hawaij Spices, Fried Onions, Dry Fruits',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 220 },
        { name: 'Duo', price: 420 },
        { name: 'Trio', price: 599 },
        { name: 'Squad', price: 800 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Tikka Mandi',
      slug: 'tikka-mandi',
      description: 'Charcoal charred tender boneless chicken tikka basted with rich butter and sumac, laid on hot saffron basmati mandi rice.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=700&auto=format&fit=crop',
      price: 240.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Chicken Tikka, Fragrant Basmati, Roasted Cashews, Toum Sauce',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 240 },
        { name: 'Duo', price: 450 },
        { name: 'Trio', price: 720 },
        { name: 'Squad', price: 1000 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Fried Wing Mandi',
      slug: 'fried-wing-mandi',
      description: 'Crispy golden fried seasoned wings with crunchy spice crust nestled on hot aromatic Arabian mandi rice.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=700&auto=format&fit=crop',
      price: 240.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Crispy Chicken Wings, Mandi Rice, Special Pepper Seasoning',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 240 },
        { name: 'Duo', price: 450 },
        { name: 'Trio', price: 720 },
        { name: 'Squad', price: 1000 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Juicy Mandi',
      slug: 'juicy-mandi',
      description: 'Slow-braised succulent tender chicken basted in rich aromatics, pure ghee, and savoury meat juices over hot basmati rice.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Succulent Chicken, Desi Ghee, Saffron Basmati, Garlic Toum',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 260 },
        { name: 'Duo', price: 480 },
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 1050 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Chicken 65 Mandi',
      slug: 'chicken-65-mandi',
      description: 'Spicy, tangy Chicken 65 tossed with curry leaves, ginger, and green chilies, served atop fragrant smoked mandi rice.',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=700&auto=format&fit=crop',
      price: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 20,
      spiceLevel: 'SPICY',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Chicken 65, Curry Leaves, Basmati Mandi, Spicy Dakkoos',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 260 },
        { name: 'Duo', price: 480 },
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 999 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Garlic Chicken Mandi',
      slug: 'garlic-chicken-mandi',
      description: 'Pan-tossed chicken infused with roasted crushed garlic, cracked black pepper, and herbs layered over aromatic mandi rice.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=700&auto=format&fit=crop',
      price: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 20,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Roasted Garlic Chicken, Black Pepper, Smoked Mandi Rice',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 260 },
        { name: 'Duo', price: 480 },
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 999 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Lollipop Mandi',
      slug: 'lollipop-mandi',
      description: 'Frenched crispy chicken lollipops seasoned with spicy house rubs served with hot smoked mandi rice, toum dip and lemon wedges.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=700&auto=format&fit=crop',
      price: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: true,
      preparationTimeMin: 20,
      spiceLevel: 'SPICY',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Chicken Lollipops, Spiced Batter, Mandi Basmati Rice',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 260 },
        { name: 'Duo', price: 480 },
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 1100 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Drumstick Mandi',
      slug: 'drumstick-mandi',
      description: 'Juicy chicken drumsticks marinated in spicy yogurt and herbs, roasted to perfection over aromatic long-grain basmati.',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=700&auto=format&fit=crop',
      price: 260.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Chicken Drumsticks, Yogurt, Hawaij Spices, Basmati Rice',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 260 },
        { name: 'Duo', price: 480 },
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 1100 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Kebab Platter Mandi',
      slug: 'kebab-platter-mandi',
      description: 'Chef special assortment of tandoori seekh and charred kebabs served on a grand platter of smoked basmati rice.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=700&auto=format&fit=crop',
      price: 280.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 25,
      spiceLevel: 'SPICY',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Seekh Kebabs, Chicken Tikkas, Mandi Rice, Toum Sauce',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 280 },
        { name: 'Duo', price: 540 },
        { name: 'Trio', price: 800 },
        { name: 'Squad', price: 1100 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Full Bird Mandi',
      slug: 'full-bird-mandi',
      description: 'A grand whole roasted chicken marinated in secret Arabian spices, slow-grilled and presented on a royal mound of mandi rice.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 900.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 35,
      spiceLevel: 'MEDIUM',
      servingSize: 'Trio (Serves 3)',
      ingredients: 'Whole Chicken, Hawaij Spices, Long Grain Basmati, Cashews, Raisins',
      sizesJson: JSON.stringify([
        { name: 'Trio', price: 900 },
        { name: 'Squad', price: 1200 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Barbeque Mandi',
      slug: 'barbeque-mandi',
      description: 'Charcoal BBQ grilled chicken basted in smoky glaze paired with authentic hot basmati rice, served with dakkoos and toum.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=700&auto=format&fit=crop',
      price: 760.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: false,
      preparationTimeMin: 30,
      spiceLevel: 'MEDIUM',
      servingSize: 'Trio (Serves 3)',
      ingredients: 'BBQ Chicken, Smoky Glaze, Saffron Basmati Rice',
      sizesJson: JSON.stringify([
        { name: 'Trio', price: 760 },
        { name: 'Squad', price: 1100 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Mutton Mandi',
      slug: 'mutton-mandi',
      description: 'Prime baby mutton ribs slow-braised to fall-off-the-bone tenderness in spiced mutton broth, served over saffron ghee basmati rice.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop',
      price: 350.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 30,
      spiceLevel: 'MEDIUM',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Tender Lamb Ribs, Ghee, Black Lime, Hawaij Spices, Fried Onions',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 350 },
        { name: 'Duo', price: 700 },
        { name: 'Trio', price: 1000 },
        { name: 'Squad', price: 1400 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Mixed Mandi (Chicken & Mutton)',
      slug: 'mixed-mandi',
      description: 'The ultimate carnivorous feast: Tandoori chicken pieces and juicy braised mutton ribs served together over fragrant basmati.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=700&auto=format&fit=crop',
      price: 600.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      isBestseller: true,
      preparationTimeMin: 30,
      spiceLevel: 'SPICY',
      servingSize: 'Duo (Serves 2)',
      ingredients: 'Mutton & Chicken Meats, Saffron Rice, Roasted Nuts',
      sizesJson: JSON.stringify([
        { name: 'Duo', price: 600 },
        { name: 'Trio', price: 899 },
        { name: 'Squad', price: 1299 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Apollo Fish Mandi',
      slug: 'apollo-fish-mandi',
      description: 'Fresh coastal fish fillets tossed in spicy tempering laid gently over hot smoked basmati mandi rice.',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=700&auto=format&fit=crop',
      price: 300.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 20,
      spiceLevel: 'SPICY',
      servingSize: 'Solo (Serves 1)',
      ingredients: 'Coastal Fish, Apollo Spices, Curry Leaves, Mandi Rice',
      sizesJson: JSON.stringify([
        { name: 'Solo', price: 300 },
        { name: 'Duo', price: 580 },
        { name: 'Trio', price: 780 },
        { name: 'Squad', price: 999 }
      ]),
    },
    {
      categoryId: catMap['mandi'],
      name: 'Prawns Mandi',
      slug: 'prawns-mandi',
      description: 'Succulent jumbo prawns pan-seared with Middle Eastern garlic butter and crushed spices over saffron mandi rice.',
      image: 'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=700&auto=format&fit=crop',
      price: 580.0,
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      preparationTimeMin: 25,
      spiceLevel: 'MEDIUM',
      servingSize: 'Duo (Serves 2)',
      ingredients: 'Fresh Prawns, Garlic Butter, Sumac, Fragrant Basmati',
      sizesJson: JSON.stringify([
        { name: 'Duo', price: 580 },
        { name: 'Trio', price: 780 },
        { name: 'Squad', price: 999 }
      ]),
    }
  ];

  // 8. NON-VEG STARTERS
  const nonVegStarters = [
    { name: 'Tangdi Kebab (1 Pc)', slug: 'tangdi-kebab-1pc', price: 170.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700' },
    { name: 'Chilli Wings (4 Pcs)', slug: 'chilli-wings-4pcs', price: 199.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700' },
    { name: 'Crispy Wings (4 Pcs)', slug: 'crispy-wings-4pcs', price: 199.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=700' },
    { name: 'Chilli Chicken', slug: 'chilli-chicken', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700' },
    { name: 'Chicken 65', slug: 'chicken-65-starter', price: 170.0, spiceLevel: 'SPICY', isBestseller: true, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=700' },
    { name: 'Chicken Manchurian', slug: 'chicken-manchurian', price: 170.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700' },
    { name: 'Chicken Tikka (4 Pcs)', slug: 'chicken-tikka-4pcs', price: 180.0, spiceLevel: 'MEDIUM', isBestseller: true, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700' },
    { name: 'Chicken Drumstick (4 Pcs)', slug: 'chicken-drumstick-4pcs', price: 190.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700' },
    { name: 'Chicken Lollipop (5 Pcs)', slug: 'chicken-lollipop-5pcs', price: 180.0, spiceLevel: 'SPICY', isBestseller: true, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700' },
    { name: 'Apollo Fish', slug: 'apollo-fish-starter', price: 190.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=700' },
  ];

  // 9. VEG STARTERS
  const vegStarters = [
    { name: 'Paneer Tikka', slug: 'paneer-tikka-starter', price: 170.0, spiceLevel: 'MEDIUM', isBestseller: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Paneer Manchurian', slug: 'paneer-manchurian', price: 170.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Paneer Chilli', slug: 'paneer-chilli', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Paneer 65', slug: 'paneer-65', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Mushroom Manchurian', slug: 'mushroom-manchurian', price: 170.0, spiceLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Chilli Mushroom', slug: 'chilli-mushroom', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Mushroom 65', slug: 'mushroom-65', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Paneer Majestic', slug: 'paneer-majestic', price: 170.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'Chilli Egg', slug: 'chilli-egg', price: 140.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700' },
    { name: 'French Fries', slug: 'french-fries', price: 110.0, spiceLevel: 'MILD', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=700' },
  ];

  // 10. BIRYANIS
  const biryanis = [
    { name: 'Chicken Dum Biryani', slug: 'chicken-dum-biryani', price: 170.0, spiceLevel: 'MEDIUM', isBestseller: true, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=700', description: 'Hyderabadi style dum cooked chicken with aromatic long-grain basmati and secret spices.' },
    { name: 'Chicken Fry Piece Biryani', slug: 'chicken-fry-piece-biryani', price: 180.0, spiceLevel: 'SPICY', isBestseller: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700', description: 'Crisp spicy Andhra-style shallow fried chicken pieces layered on hot dum basmati rice.' },
    { name: 'Chicken Joint Biryani', slug: 'chicken-joint-biryani', price: 190.0, spiceLevel: 'SPICY', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700', description: 'Whole tender chicken joint roasted in aromatic masala and served with spiced biryani rice.' },
  ];

  // 11. DESSERTS & DRINKS
  const dessertsAndDrinks = [
    { name: 'Royal Cheese Kunafa', slug: 'royal-cheese-kunafa', price: 249.0, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=700', description: 'Stretchy hot sweet cheese inside a crisp kataifi vermicelli crust soaked in rose syrup & crushed pistachios.' },
    { name: 'Arabian Mint Lime Cooler', slug: 'mint-lime-cooler', price: 79.0, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700', description: 'Hand-crushed fresh mint leaves, lime juice, and sparkling soda.' },
    { name: 'Saudi Champagne', slug: 'saudi-champagne', price: 160.0, isVeg: true, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=700', description: 'Chilled sparkling apple cider mocktail with sliced fresh oranges and mint.' },
  ];

  // Insert Mandis
  for (const m of mandiItems) {
    const created = await prisma.menuItem.create({ data: m });
    // Add signature addons to each Mandi item
    const addons = [
      { name: 'Extra Mandi Rice Portion', price: 100.0 },
      { name: 'Authentic Toum Garlic Dip (100ml)', price: 40.0 },
      { name: 'Fiery Dakkoos / Shatta Sauce', price: 30.0 },
      { name: 'Toasted Almonds & Cashews Garnish', price: 50.0 },
      { name: 'Thums Up (750ml Pet Bottle)', price: 45.0 },
    ];
    for (const a of addons) {
      await prisma.menuItemAddon.create({
        data: {
          menuItemId: created.id,
          name: a.name,
          price: a.price,
          isAvailable: true,
        },
      });
    }
  }

  // Insert Non-Veg Starters
  for (const s of nonVegStarters) {
    await prisma.menuItem.create({
      data: {
        categoryId: catMap['non-veg-starters'],
        name: s.name,
        slug: s.slug,
        description: `Fresh, piping-hot ${s.name} prepared with fiery spices. Perfect starter before your Mandi.`,
        price: s.price,
        isVeg: false,
        isAvailable: true,
        isBestseller: s.isBestseller || false,
        spiceLevel: s.spiceLevel,
        image: s.image,
      },
    });
  }

  // Insert Veg Starters
  for (const v of vegStarters) {
    await prisma.menuItem.create({
      data: {
        categoryId: catMap['veg-starters'],
        name: v.name,
        slug: v.slug,
        description: `Crisp & flavourful ${v.name} crafted with fresh vegetarian ingredients.`,
        price: v.price,
        isVeg: v.name !== 'Chilli Egg',
        isAvailable: true,
        isBestseller: v.isBestseller || false,
        spiceLevel: v.spiceLevel,
        image: v.image,
      },
    });
  }

  // Insert Biryanis
  for (const b of biryanis) {
    await prisma.menuItem.create({
      data: {
        categoryId: catMap['biryani'],
        name: b.name,
        slug: b.slug,
        description: b.description,
        price: b.price,
        isVeg: false,
        isAvailable: true,
        isBestseller: b.isBestseller || false,
        spiceLevel: b.spiceLevel,
        image: b.image,
      },
    });
  }

  // Insert Desserts & Drinks
  for (const d of dessertsAndDrinks) {
    await prisma.menuItem.create({
      data: {
        categoryId: catMap['desserts-drinks'],
        name: d.name,
        slug: d.slug,
        description: d.description,
        price: d.price,
        isVeg: d.isVeg,
        isAvailable: true,
        isBestseller: d.isBestseller || false,
        spiceLevel: 'MILD',
        image: d.image,
      },
    });
  }

  console.log('Seeded all S & H Arabian Mandi dishes, starters, biryanis & desserts successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
