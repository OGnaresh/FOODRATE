// ===================================================================
// MOCK DATA - Restaurant Rating App
// Contains: Users, Restaurants, Reviews, and Sample Preferences
// ===================================================================

const MOCK_DATA = {
    // Current logged-in user (will be updated on login)
    currentUser: null,

    // Sample users for authentication
    users: [
        {
            id: 'user1',
            name: 'Rahul Kumar',
            email: 'rahul@example.com',
            password: 'password123',
            preferences: {
                cuisines: ['Indian', 'North Indian', 'Street Food'],
                budget: 'medium',
                ambiance: ['casual', 'family-friendly'],
                dietary: ['non-vegetarian'],
                dietary_restrictions: []
            },
            savedRestaurants: [],
            submittedReviews: [],
            profilePic: '👨‍💼'
        },
        {
            id: 'user2',
            name: 'Priya Singh',
            email: 'priya@example.com',
            password: 'password123',
            preferences: {
                cuisines: ['Italian', 'Cafe', 'Desserts'],
                budget: 'high',
                ambiance: ['romantic', 'upscale'],
                dietary: ['vegetarian'],
                dietary_restrictions: ['gluten-free']
            },
            savedRestaurants: [],
            submittedReviews: [],
            profilePic: '👩‍💼'
        },
        {
            id: 'user3',
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'demo123',
            preferences: {
                cuisines: ['Chinese', 'North Indian', 'Cafe'],
                budget: 'medium',
                ambiance: ['casual', 'family-friendly'],
                dietary: ['vegetarian', 'non-vegetarian'],
                dietary_restrictions: []
            },
            savedRestaurants: [],
            submittedReviews: [],
            profilePic: '👤'
        }
    ],

    // Comprehensive restaurant database
    restaurants: [
        {
            id: 'rest1',
            name: 'Taj Flavors',
            cuisine: 'North Indian',
            location: 'Connaught Place, Delhi',
            rating: 4.8,
            reviewCount: 342,
            priceRange: '$$$',
            budget: 'high',
            ambiance: ['upscale', 'family-friendly'],
            image: '🏛️',
            description: 'Premium North Indian cuisine with authentic flavors',
            tags: ['Vegetarian', 'Non-Vegetarian', 'Family Dining'],
            hours: '12:00 PM - 11:00 PM',
            phone: '+91-11-4141-4141',
            website: 'tajflavors.com',
            verified: true,
            speciality: ['Butter Chicken', 'Tandoori Naan', 'Biryani'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest2',
            name: 'Street Tales',
            cuisine: 'Street Food',
            location: 'Chandni Chowk, Delhi',
            rating: 4.5,
            reviewCount: 521,
            priceRange: '$',
            budget: 'low',
            ambiance: ['casual', 'quick-bites'],
            image: '🍢',
            description: 'Authentic street food experience',
            tags: ['Budget-Friendly', 'Quick Service', 'Must Try'],
            hours: '10:00 AM - 11:00 PM',
            phone: '+91-11-2325-2325',
            website: 'streettales.com',
            verified: true,
            speciality: ['Chaat', 'Momos', 'Kebabs'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest3',
            name: 'Bella Italia',
            cuisine: 'Italian',
            location: 'Bandra, Mumbai',
            rating: 4.7,
            reviewCount: 289,
            priceRange: '$$$',
            budget: 'high',
            ambiance: ['romantic', 'upscale', 'date-night'],
            image: '🍝',
            description: 'Authentic Italian dining with Mediterranean flavors',
            tags: ['Romantic', 'Wine Selection', 'Desserts'],
            hours: '12:00 PM - 11:30 PM',
            phone: '+91-22-6161-6161',
            website: 'bellaitalia.com',
            verified: true,
            speciality: ['Pasta', 'Risotto', 'Tiramisu'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest4',
            name: 'Brew & Bean',
            cuisine: 'Cafe',
            location: 'Koramangala, Bangalore',
            rating: 4.6,
            reviewCount: 412,
            priceRange: '$$',
            budget: 'medium',
            ambiance: ['cozy', 'work-friendly', 'casual'],
            image: '☕',
            description: 'Artisanal coffee and light bites',
            tags: ['WiFi Available', 'Coffee Lover', 'Quiet Space'],
            hours: '7:00 AM - 8:00 PM',
            phone: '+91-80-4161-4161',
            website: 'brewbean.com',
            verified: true,
            speciality: ['Espresso', 'Cold Brew', 'Sandwiches'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest5',
            name: 'Dim Sum Dragon',
            cuisine: 'Chinese',
            location: 'Sector 18, Noida',
            rating: 4.4,
            reviewCount: 198,
            priceRange: '$$',
            budget: 'medium',
            ambiance: ['casual', 'family-friendly'],
            image: '🥢',
            description: 'Authentic Chinese dim sum and noodles',
            tags: ['Vegetarian Options', 'Family Dining', 'Group Friendly'],
            hours: '11:00 AM - 10:30 PM',
            phone: '+91-120-4141-4141',
            website: 'dimsumdragon.com',
            verified: false,
            speciality: ['Dim Sum', 'Fried Rice', 'Hakka Noodles'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest6',
            name: 'South Spice',
            cuisine: 'South Indian',
            location: 'Whitefield, Bangalore',
            rating: 4.9,
            reviewCount: 567,
            priceRange: '$$',
            budget: 'medium',
            ambiance: ['family-friendly', 'casual'],
            image: '🍛',
            description: 'Traditional South Indian cuisine',
            tags: ['Vegetarian', 'Lunch Special', 'Traditional'],
            hours: '6:00 AM - 10:00 PM',
            phone: '+91-80-2161-2161',
            website: 'southspice.com',
            verified: true,
            speciality: ['Dosa', 'Idli', 'Sambar'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest7',
            name: 'Grill House Prime',
            cuisine: 'Continental',
            location: 'Jubilee Hills, Hyderabad',
            rating: 4.7,
            reviewCount: 234,
            priceRange: '$$$',
            budget: 'high',
            ambiance: ['upscale', 'romantic', 'business-dinner'],
            image: '🥩',
            description: 'Premium grill cuisine and steaks',
            tags: ['Steaks', 'Wine Pairing', 'Special Occasions'],
            hours: '12:00 PM - 11:00 PM',
            phone: '+91-40-6161-6161',
            website: 'grillhouseprime.com',
            verified: true,
            speciality: ['Steaks', 'Grilled Fish', 'BBQ'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest8',
            name: 'Spice Garden',
            cuisine: 'North Indian',
            location: 'Thane, Mumbai',
            rating: 4.3,
            reviewCount: 156,
            priceRange: '$$',
            budget: 'medium',
            ambiance: ['casual', 'family-friendly', 'quick-service'],
            image: '🌶️',
            description: 'North Indian home-style cooking',
            tags: ['Home-style', 'Budget-Friendly', 'Family Dining'],
            hours: '11:00 AM - 10:30 PM',
            phone: '+91-22-4161-4161',
            website: 'spicegarden.com',
            verified: false,
            speciality: ['Paneer Dishes', 'Breads', 'Curries'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest9',
            name: 'Sakura Sushi',
            cuisine: 'Japanese',
            location: 'Cyber City, Gurgaon',
            rating: 4.8,
            reviewCount: 423,
            priceRange: '$$$',
            budget: 'high',
            ambiance: ['upscale', 'date-night', 'modern'],
            image: '🍣',
            description: 'Premium Japanese sushi and tempura',
            tags: ['Sushi', 'Authentic', 'Fine Dining'],
            hours: '12:00 PM - 11:00 PM',
            phone: '+91-124-4141-4141',
            website: 'sakurasushi.com',
            verified: true,
            speciality: ['Sushi Rolls', 'Tempura', 'Miso Soup'],
            reviews: [],
            matchScore: 0
        },
        {
            id: 'rest10',
            name: 'The Bake House',
            cuisine: 'Bakery & Cafe',
            location: 'Indiranagar, Bangalore',
            rating: 4.6,
            reviewCount: 345,
            priceRange: '$$',
            budget: 'medium',
            ambiance: ['cozy', 'family-friendly', 'casual'],
            image: '🍰',
            description: 'Artisanal bakery with fresh pastries',
            tags: ['Bakery', 'Coffee', 'Desserts', 'WiFi'],
            hours: '7:00 AM - 9:00 PM',
            phone: '+91-80-4161-4161',
            website: 'thebakehouse.com',
            verified: true,
            speciality: ['Croissants', 'Cakes', 'Bread'],
            reviews: [],
            matchScore: 0
        }
    ],

    // Sample reviews with ratings
    sampleReviews: [
        {
            id: 'rev1',
            restaurantId: 'rest1',
            userId: 'user2',
            userName: 'Priya Singh',
            rating: 5,
            title: 'Exceptional dining experience',
            review: 'The butter chicken was absolutely delicious. Staff was very courteous and attentive.',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            verified: true,
            foodRating: 5,
            serviceRating: 5,
            ambianceRating: 4,
            valueRating: 4,
            helpful: 45
        },
        {
            id: 'rev2',
            restaurantId: 'rest1',
            userId: 'user1',
            userName: 'Rahul Kumar',
            rating: 4,
            title: 'Great food, slightly pricey',
            review: 'Authentic North Indian taste. Portions could be bigger for the price.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            verified: true,
            foodRating: 4,
            serviceRating: 4,
            ambianceRating: 4,
            valueRating: 3,
            helpful: 23
        },
        {
            id: 'rev3',
            restaurantId: 'rest2',
            userId: 'user1',
            userName: 'Rahul Kumar',
            rating: 5,
            title: 'Best street food in town',
            review: 'Authentic chaat and momos. The flavors are incredible for the price.',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            verified: true,
            foodRating: 5,
            serviceRating: 4,
            ambianceRating: 3,
            valueRating: 5,
            helpful: 67
        },
        {
            id: 'rev4',
            restaurantId: 'rest3',
            userId: 'user2',
            userName: 'Priya Singh',
            rating: 5,
            title: 'Perfect for romantic dinner',
            review: 'Beautiful ambiance, delicious pasta, and excellent wine selection.',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            verified: true,
            foodRating: 5,
            serviceRating: 5,
            ambianceRating: 5,
            valueRating: 4,
            helpful: 89
        },
        {
            id: 'rev5',
            restaurantId: 'rest4',
            userId: 'user3',
            userName: 'Demo User',
            rating: 4,
            title: 'Great coffee and workspace',
            review: 'Amazing cold brew and very productive place to work. Highly recommended.',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            verified: true,
            foodRating: 4,
            serviceRating: 4,
            ambianceRating: 5,
            valueRating: 4,
            helpful: 34
        }
    ]
};

// Initialize sample reviews into restaurants
MOCK_DATA.sampleReviews.forEach(review => {
    const restaurant = MOCK_DATA.restaurants.find(r => r.id === review.restaurantId);
    if (restaurant) {
        restaurant.reviews.push(review);
    }
});

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MOCK_DATA;
}
