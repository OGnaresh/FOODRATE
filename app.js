// ===================================================================
// RESTAURANT RATING APP - MAIN APPLICATION
// Part 1: Core Structure & State Management
// ===================================================================

class RestaurantApp {
    constructor() {
        this.state = {
            currentUser: null,
            restaurants: [],
            filteredRestaurants: [],
            currentPage: 'home',
            matchResults: [],
            preferences: {},
            savedRestaurants: new Set()
        };

        this.elements = {
            app: document.getElementById('app'),
            modal: document.getElementById('auth-modal'),
            toast: document.getElementById('toast'),
            modalBody: document.getElementById('modal-body'),
            modalOverlay: document.querySelector('.modal-overlay')
        };

        this.init();
    }

    // ==================== INITIALIZATION ====================
    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    loadMockData() {
        this.state.restaurants = JSON.parse(JSON.stringify(MOCK_DATA.restaurants));
        this.state.filteredRestaurants = [...this.state.restaurants];
    }

    setupEventListeners() {
        // Modal close
        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target === this.elements.modal || e.target.closest('.modal-close')) {
                    this.closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.state.currentUser = JSON.parse(savedUser);
            this.state.savedRestaurants = new Set(JSON.parse(localStorage.getItem('savedRestaurants') || '[]'));
            this.renderApp();
        } else {
            this.showLoginPage();
        }
    }

    // ==================== AUTHENTICATION ====================
    showLoginPage() {
        this.elements.app.innerHTML = `
            <div class="app-container">
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--spacing-2xl); text-align: center;">
                    <div style="font-size: 64px; margin-bottom: var(--spacing-lg);">🍽️</div>
                    <h1 class="section-title">RestaurantMatch</h1>
                    <p class="section-subtitle" style="margin-bottom: var(--spacing-2xl);">Find your perfect dining experience</p>
                    
                    <button class="btn btn-primary" id="login-btn" style="margin-bottom: var(--spacing-md);">Login</button>
                    <button class="btn btn-secondary" id="signup-btn">Sign Up</button>
                </div>
            </div>
        `;

        document.getElementById('login-btn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('signup-btn')?.addEventListener('click', () => this.showSignupModal());
    }

    showLoginModal() {
        this.elements.modalBody.innerHTML = `
            <h2 class="modal-title">Welcome Back</h2>
            <form id="login-form" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p style="text-align: center; font-size: 12px; color: var(--color-text-secondary); margin-top: var(--spacing-md);">
                    Demo credentials: demo@example.com / demo123
                </p>
            </form>
        `;

        this.openModal();

        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.handleLogin(formData.get('email'), formData.get('password'));
        });
    }

    showSignupModal() {
        this.elements.modalBody.innerHTML = `
            <h2 class="modal-title">Create Account</h2>
            <form id="signup-form" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" name="name" class="form-input" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-input" placeholder="Create a password" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
            </form>
        `;

        this.openModal();

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.handleSignup(
                formData.get('name'),
                formData.get('email'),
                formData.get('password')
            );
        });
    }

    handleLogin(email, password) {
        const user = MOCK_DATA.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.state.currentUser = { ...user };
            this.state.savedRestaurants = new Set(user.savedRestaurants || []);
            localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
            localStorage.setItem('savedRestaurants', JSON.stringify([...this.state.savedRestaurants]));
            this.closeModal();
            this.renderApp();
            this.showToast('Successfully logged in!', 'success');
        } else {
            this.showToast('Invalid email or password', 'error');
        }
    }

    handleSignup(name, email, password) {
        const newUser = {
            id: `user${Date.now()}`,
            name,
            email,
            password,
            preferences: {
                cuisines: [],
                budget: 'medium',
                ambiance: [],
                dietary: [],
                dietary_restrictions: []
            },
            savedRestaurants: [],
            submittedReviews: [],
            profilePic: '👤'
        };

        MOCK_DATA.users.push(newUser);
        this.state.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('savedRestaurants', JSON.stringify([]));
        this.closeModal();
        this.renderApp();
        this.showToast(`Welcome ${name}! Let's find your perfect restaurant.`, 'success');
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('savedRestaurants');
        this.state.currentUser = null;
        this.state.savedRestaurants = new Set();
        this.showLoginPage();
        this.showToast('Logged out successfully', 'success');
    }

    // ==================== MAIN APP RENDER ====================
    renderApp() {
        const header = this.renderHeader();
        const content = this.renderContent();
        const nav = this.renderBottomNav();

        this.elements.app.innerHTML = `
            <div class="app-container">
                ${header}
                <div class="app-content" id="content">
                    ${content}
                </div>
                <div class="app-footer">
                    ${nav}
                </div>
            </div>
        `;

        this.attachContentEventListeners();
    }

    renderHeader() {
        return `
            <div class="app-header">
                <div class="header">
                    <div class="header-left">
                        <div class="logo">🍽️</div>
                        <div>
                            <div class="header-title">RestaurantMatch</div>
                            <div class="header-location">📍 Your City</div>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="header-btn" id="search-btn" title="Search">🔍</button>
                        <button class="header-btn" id="notifications-btn" title="Notifications">🔔</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderContent() {
        switch (this.state.currentPage) {
            case 'home':
                return this.renderHomePage();
            case 'discover':
                return this.renderDiscoverPage();
            case 'saved':
                return this.renderSavedPage();
            case 'matches':
                return this.renderMatchesPage();
            case 'profile':
                return this.renderProfilePage();
            default:
                return this.renderHomePage();
        }
    }

    // ==================== HOME PAGE ====================
    renderHomePage() {
        const featured = this.state.restaurants.slice(0, 3);
        
        return `
            <section class="section">
                <div class="section-header">
                    <h1 class="section-title">Welcome, ${this.state.currentUser.name.split(' ')[0]}! 👋</h1>
                    <p class="section-subtitle">Discover and rate amazing restaurants near you</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                    <div class="card" id="match-btn-card" style="cursor: pointer; text-align: center;">
                        <div class="card-icon">🎯</div>
                        <div class="card-title">Find My Match</div>
                        <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">Get personalized recommendations</p>
                    </div>
                    <div class="card" id="discover-btn-card" style="cursor: pointer; text-align: center;">
                        <div class="card-icon">🔍</div>
                        <div class="card-title">Discover</div>
                        <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">Browse all restaurants</p>
                    </div>
                </div>

                <div>
                    <div class="section-header">
                        <h2 class="section-title">Featured Restaurants</h2>
                    </div>
                    ${featured.map(restaurant => this.renderRestaurantCard(restaurant)).join('')}
                </div>
            </section>
        `;
    }

    // ==================== DISCOVER PAGE ====================
    renderDiscoverPage() {
        return `
            <section class="section">
                <div class="search-bar">
                    <div class="search-input-wrapper">
                        <div class="search-icon">🔍</div>
                        <input type="text" class="search-input" id="search-field" placeholder="Search restaurants...">
                    </div>
                </div>

                <div style="padding: var(--spacing-lg) 0;">
                    <div class="section-header">
                        <h2 class="section-title">Filter Results</h2>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Cuisine Type</label>
                        <div class="filter-options">
                            <button class="filter-btn cuisine-filter active" data-cuisine="All">All</button>
                            <button class="filter-btn cuisine-filter" data-cuisine="North Indian">North Indian</button>
                            <button class="filter-btn cuisine-filter" data-cuisine="Italian">Italian</button>
                            <button class="filter-btn cuisine-filter" data-cuisine="Chinese">Chinese</button>
                            <button class="filter-btn cuisine-filter" data-cuisine="Cafe">Cafe</button>
                        </div>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Budget</label>
                        <div class="filter-options">
                            <button class="filter-btn budget-filter active" data-budget="all">All</button>
                            <button class="filter-btn budget-filter" data-budget="low">Budget ($)</button>
                            <button class="filter-btn budget-filter" data-budget="medium">Medium ($$)</button>
                            <button class="filter-btn budget-filter" data-budget="high">Premium ($$$)</button>
                        </div>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Rating</label>
                        <div class="filter-options">
                            <button class="filter-btn rating-filter active" data-rating="all">All</button>
                            <button class="filter-btn rating-filter" data-rating="4.5">4.5+ ⭐</button>
                            <button class="filter-btn rating-filter" data-rating="4.7">4.7+ ⭐</button>
                            <button class="filter-btn rating-filter" data-rating="4.9">4.9+ ⭐</button>
                        </div>
                    </div>
                </div>

                <div id="restaurants-list" style="padding: 0 var(--spacing-lg);">
                    ${this.renderRestaurantsList(this.state.filteredRestaurants)}
                </div>
            </section>
        `;
    }

    renderRestaurantsList(restaurants) {
        if (restaurants.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-title">No Restaurants Found</div>
                    <p class="empty-text">Try adjusting your filters</p>
                </div>
            `;
        }
        return restaurants.map(r => this.renderRestaurantCard(r)).join('');
    }

    renderRestaurantCard(restaurant) {
        const isSaved = this.state.savedRestaurants.has(restaurant.id);
        return `
            <div class="restaurant-card" data-id="${restaurant.id}">
                <div class="restaurant-card-image">
                    <div>${restaurant.image}</div>
                    <div class="restaurant-card-badge">
                        ${this.renderStars(restaurant.rating)} ${restaurant.rating}
                    </div>
                </div>
                <div class="restaurant-card-body">
                    <div class="restaurant-name">
                        ${restaurant.name}
                        ${restaurant.verified ? '<span class="restaurant-verified">✓</span>' : ''}
                    </div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                    <div class="restaurant-meta">
                        <span class="restaurant-location">📍 ${restaurant.location}</span>
                        <span class="restaurant-rating">${this.renderStars(restaurant.rating)} ${restaurant.rating}</span>
                    </div>
                    <div class="restaurant-tags">
                        ${restaurant.speciality.slice(0, 2).map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                    <div class="restaurant-actions">
                        <button class="restaurant-action-btn save-btn" data-id="${restaurant.id}">
                            ${isSaved ? '❤️ Saved' : '🤍 Save'}
                        </button>
                        <button class="restaurant-action-btn primary view-btn" data-id="${restaurant.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== SAVED PAGE ====================
    renderSavedPage() {
        const saved = this.state.restaurants.filter(r => this.state.savedRestaurants.has(r.id));
        
        return `
            <section class="section">
                <div class="section-header">
                    <h1 class="section-title">Saved Restaurants</h1>
                    <p class="section-subtitle">${saved.length} favorite${saved.length !== 1 ? 's' : ''} saved</p>
                </div>

                ${saved.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">❤️</div>
                        <div class="empty-title">No Saved Restaurants</div>
                        <p class="empty-text">Start saving your favorite places</p>
                    </div>
                ` : `
                    <div id="saved-list">
                        ${saved.map(r => this.renderRestaurantCard(r)).join('')}
                    </div>
                `}
            </section>
        `;
    }

    // ==================== MATCHES PAGE ====================
    renderMatchesPage() {
        return `
            <section class="section">
                <div class="section-header">
                    <h1 class="section-title">Find Your Match</h1>
                    <p class="section-subtitle">Answer a few questions to get personalized recommendations</p>
                </div>

                <form id="preferences-form" style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                    <div class="form-group">
                        <label class="form-label">What cuisines do you love?</label>
                        <div class="matcher-options">
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="North Indian">
                                North Indian
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="Italian">
                                Italian
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="Chinese">
                                Chinese
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="South Indian">
                                South Indian
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="Cafe">
                                Cafe
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="cuisines" value="Street Food">
                                Street Food
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">What's your budget?</label>
                        <div class="matcher-options">
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="radio" name="budget" value="low">
                                Budget ($)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="radio" name="budget" value="medium" checked>
                                Medium ($$)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="radio" name="budget" value="high">
                                Premium ($$$)
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">What's the occasion?</label>
                        <div class="matcher-options">
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="ambiance" value="casual">
                                Casual
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="ambiance" value="family-friendly">
                                Family Friendly
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="ambiance" value="romantic">
                                Romantic
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="ambiance" value="upscale">
                                Upscale
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Dietary preferences</label>
                        <div class="matcher-options">
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="dietary" value="vegetarian">
                                Vegetarian
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="dietary" value="non-vegetarian">
                                Non-Vegetarian
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                                <input type="checkbox" name="dietary" value="vegan">
                                Vegan
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Find My Matches</button>
                </form>

                ${this.state.matchResults.length > 0 ? `
                    <div style="margin-top: var(--spacing-2xl);">
                        <div class="section-header">
                            <h2 class="section-title">Your Perfect Matches</h2>
                        </div>
                        ${this.state.matchResults.map(r => `
                            <div class="match-card">
                                <div class="match-score">${Math.round(r.matchScore)}% Match</div>
                                ${this.renderRestaurantCard(r)}
                                <div class="match-reasons">
                                    <div style="font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Why this match:</div>
                                    ${r.matchReasons.map(reason => `
                                        <div class="match-reason">
                                            <span class="match-reason-icon">✓</span>
                                            <span>${reason}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </section>
        `;
    }

    // ==================== PROFILE PAGE ====================
    renderProfilePage() {
        return `
            <div class="profile-header">
                <div class="profile-avatar">${this.state.currentUser.profilePic}</div>
                <div class="profile-name">${this.state.currentUser.name}</div>
                <div class="profile-email">${this.state.currentUser.email}</div>
            </div>

            <section class="section">
                <div class="profile-menu">
                    <button class="profile-menu-item" id="edit-preferences-btn">
                        <span>Edit Preferences</span>
                        <span class="profile-menu-icon">→</span>
                    </button>
                    <button class="profile-menu-item" id="my-reviews-btn">
                        <span>My Reviews (${this.state.currentUser.submittedReviews.length})</span>
                        <span class="profile-menu-icon">→</span>
                    </button>
                    <button class="profile-menu-item" id="about-btn">
                        <span>About RestaurantMatch</span>
                        <span class="profile-menu-icon">→</span>
                    </button>
                    <button class="profile-menu-item" id="logout-btn" style="border-top: none; color: var(--color-error);">
                        <span>Logout</span>
                        <span class="profile-menu-icon">→</span>
                    </button>
                </div>
            </section>
        `;
    }

    // ==================== UTILITY METHODS ====================
    renderStars(rating) {
        const full = Math.floor(rating);
        const empty = 5 - full;
        return '⭐'.repeat(full) + '☆'.repeat(empty);
    }

    openModal() {
        this.elements.modal.removeAttribute('hidden');
    }

    closeModal() {
        this.elements.modal.setAttribute('hidden', '');
    }

    showToast(message, type = 'default') {
        if (!this.elements.toast) return;
        this.elements.toast.textContent = message;
        this.elements.toast.className = 'toast show';
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    navigateTo(page) {
        this.state.currentPage = page;
        this.renderApp();
        window.scrollTo(0, 0);
    }

    calculateMatch(restaurant) {
        let score = 0;
        const preferences = this.state.preferences;

        // Cuisine match
        if (preferences.cuisines && preferences.cuisines.length > 0) {
            if (preferences.cuisines.includes(restaurant.cuisine)) {
                score += 30;
            }
        }

        // Budget match
        if (preferences.budget === restaurant.budget) {
            score += 25;
        }

        // Ambiance match
        if (preferences.ambiance && preferences.ambiance.length > 0) {
            const matching = preferences.ambiance.filter(a => restaurant.ambiance.includes(a)).length;
            score += (matching / preferences.ambiance.length) * 25;
        }

        // Rating bonus
        if (restaurant.rating >= 4.8) {
            score += 10;
        } else if (restaurant.rating >= 4.5) {
            score += 5;
        }

        return Math.min(100, score);
    }

    attachContentEventListeners() {
        // Search button in header
        document.getElementById('search-btn')?.addEventListener('click', () => {
            this.navigateTo('discover');
        });

        // Home page quick actions
        document.getElementById('match-btn-card')?.addEventListener('click', () => {
            this.navigateTo('matches');
        });

        document.getElementById('discover-btn-card')?.addEventListener('click', () => {
            this.navigateTo('discover');
        });

        // Discover page filters
        document.querySelectorAll('.cuisine-filter').forEach(btn => {
            btn.addEventListener('click', () => this.applyFilters());
        });

        document.querySelectorAll('.budget-filter').forEach(btn => {
            btn.addEventListener('click', () => this.applyFilters());
        });

        document.querySelectorAll('.rating-filter').forEach(btn => {
            btn.addEventListener('click', () => this.applyFilters());
        });

        // Search
        document.getElementById('search-field')?.addEventListener('input', () => {
            this.applyFilters();
        });

        // Restaurant cards - Save button
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (this.state.savedRestaurants.has(id)) {
                    this.state.savedRestaurants.delete(id);
                    this.showToast('Removed from saved');
                } else {
                    this.state.savedRestaurants.add(id);
                    this.showToast('Added to saved');
                }
                localStorage.setItem('savedRestaurants', JSON.stringify([...this.state.savedRestaurants]));
                this.renderApp();
            });
        });

        // Restaurant cards - View details
        document.querySelectorAll('.view-btn, .restaurant-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.restaurant-card');
                const id = card?.dataset.id;
                if (id) this.showRestaurantDetails(id);
            });
        });

        // Preferences form
        document.getElementById('preferences-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePreferencesSubmit();
        });

        // Profile menu
        document.getElementById('edit-preferences-btn')?.addEventListener('click', () => {
            this.navigateTo('matches');
        });

        document.getElementById('my-reviews-btn')?.addEventListener('click', () => {
            this.showMyReviews();
        });

        document.getElementById('about-btn')?.addEventListener('click', () => {
            this.showAbout();
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            const pages = ['home', 'discover', 'saved', 'matches', 'profile'];
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.navigateTo(pages[index]);
            });
        });

        // Update nav active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            const pages = ['home', 'discover', 'saved', 'matches', 'profile'];
            if (pages[index] === this.state.currentPage) {
                item.classList.add('active');
            }
        });
    }

    applyFilters() {
        const searchTerm = (document.getElementById('search-field')?.value || '').toLowerCase();
        const activeCuisine = document.querySelector('.cuisine-filter.active')?.dataset.cuisine || 'All';
        const activeBudget = document.querySelector('.budget-filter.active')?.dataset.budget || 'all';
        const activeRating = document.querySelector('.rating-filter.active')?.dataset.rating || 'all';

        this.state.filteredRestaurants = this.state.restaurants.filter(restaurant => {
            const matchesSearch = searchTerm === '' ||
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.cuisine.toLowerCase().includes(searchTerm);

            const matchesCuisine = activeCuisine === 'All' || restaurant.cuisine === activeCuisine;

            const budgetMap = { 'low': 'low', 'medium': 'medium', 'high': 'high', 'all': null };
            const matchesBudget = budgetMap[activeBudget] === null || restaurant.budget === budgetMap[activeBudget];

            const ratingValue = parseFloat(activeRating);
            const matchesRating = isNaN(ratingValue) || restaurant.rating >= ratingValue;

            return matchesSearch && matchesCuisine && matchesBudget && matchesRating;
        });

        // Update filter buttons
        document.querySelectorAll('.cuisine-filter, .budget-filter, .rating-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        event?.target?.classList.add('active');

        const restaurantsList = document.getElementById('restaurants-list');
        if (restaurantsList) {
            restaurantsList.innerHTML = this.renderRestaurantsList(this.state.filteredRestaurants);
        }
    }

    handlePreferencesSubmit() {
        const form = document.getElementById('preferences-form');
        if (!form) return;

        const formData = new FormData(form);
        const preferences = {
            cuisines: formData.getAll('cuisines'),
            budget: formData.get('budget'),
            ambiance: formData.getAll('ambiance'),
            dietary: formData.getAll('dietary')
        };

        this.state.preferences = preferences;

        // Calculate matches
        this.state.matchResults = this.state.restaurants
            .map(restaurant => ({
                ...restaurant,
                matchScore: this.calculateMatch(restaurant),
                matchReasons: this.getMatchReasons(restaurant, preferences)
            }))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);

        this.renderApp();
        this.showToast('Found perfect matches for you!');
    }

    getMatchReasons(restaurant, preferences) {
        const reasons = [];

        if (preferences.cuisines.includes(restaurant.cuisine)) {
            reasons.push(`Specializes in ${restaurant.cuisine}`);
        }

        if (restaurant.budget === preferences.budget) {
            reasons.push(`Within your budget`);
        }

        const matchingAmbianze = preferences.ambiance.filter(a => restaurant.ambiance.includes(a));
        if (matchingAmbianze.length > 0) {
            reasons.push(`Perfect for ${matchingAmbianze[0]} dining`);
        }

        if (restaurant.rating >= 4.8) {
            reasons.push(`Highly rated (${restaurant.rating}★)`);
        }

        return reasons;
    }

    showRestaurantDetails(restaurantId) {
        const restaurant = this.state.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        this.elements.modalBody.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                <div style="font-size: 48px;">${restaurant.image}</div>
                <div>
                    <h2 class="modal-title" style="margin: 0 0 4px 0;">${restaurant.name}</h2>
                    <p class="section-subtitle" style="margin: 0;">${restaurant.cuisine} • ${restaurant.location}</p>
                </div>
            </div>

            <div style="background: var(--color-background); padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                    <div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 4px;">Rating</div>
                        <div style="font-size: 18px; font-weight: 700; color: var(--color-primary);">${this.renderStars(restaurant.rating)} ${restaurant.rating}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 4px;">Reviews</div>
                        <div style="font-size: 18px; font-weight: 700;">${restaurant.reviewCount}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 4px;">Hours</div>
                        <div style="font-size: 14px;">${restaurant.hours}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 4px;">Phone</div>
                        <div style="font-size: 14px;">${restaurant.phone}</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: var(--spacing-lg);">
                <h3 class="section-title">Specialties</h3>
                <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                    ${restaurant.speciality.map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
            </div>

            <div style="margin-bottom: var(--spacing-lg);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <h3 class="section-title">Reviews</h3>
                </div>
                ${restaurant.reviews.length === 0 ? `
                    <p class="section-subtitle">No reviews yet. Be the first to review!</p>
                ` : `
                    ${restaurant.reviews.slice(0, 3).map(review => this.renderReviewCard(review)).join('')}
                `}
            </div>

            <button class="btn btn-primary" id="write-review-btn">Write a Review</button>
            <button class="btn btn-secondary" style="margin-top: var(--spacing-md);" data-mt-close>Close</button>
        `;

        this.openModal();

        document.getElementById('write-review-btn')?.addEventListener('click', () => {
            this.showWriteReviewModal(restaurant);
        });
    }

    renderReviewCard(review) {
        return `
            <div class="review-card">
                <div class="review-header">
                    <div>
                        <div class="review-author">${review.userName}</div>
                        <div class="review-date">${this.formatDate(review.date)}</div>
                    </div>
                    <div class="rating-display">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                <div style="margin-bottom: var(--spacing-md); font-weight: 600; color: var(--color-text);">${review.title}</div>
                <p class="review-text">${review.review}</p>
                <div class="review-ratings">
                    <div class="rating-row">
                        <div class="rating-label">Food</div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${review.foodRating * 20}%"></div>
                        </div>
                    </div>
                    <div class="rating-row">
                        <div class="rating-label">Service</div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${review.serviceRating * 20}%"></div>
                        </div>
                    </div>
                    <div class="rating-row">
                        <div class="rating-label">Ambiance</div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${review.ambianceRating * 20}%"></div>
                        </div>
                    </div>
                    <div class="rating-row">
                        <div class="rating-label">Value</div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${review.valueRating * 20}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showWriteReviewModal(restaurant) {
        this.elements.modalBody.innerHTML = `
            <h2 class="modal-title">Review ${restaurant.name}</h2>
            <form id="review-form" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div class="form-group">
                    <label class="form-label">Rating</label>
                    <div class="rating-input" id="review-rating">
                        ${[1, 2, 3, 4, 5].map(i => `<button type="button" class="star-btn" data-rating="${i}">⭐</button>`).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-input" placeholder="e.g., Amazing food and service" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Your Review</label>
                    <textarea name="review" class="form-textarea" placeholder="Share your experience..." required></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Food Quality</label>
                    <div class="rating-input" id="food-rating">
                        ${[1, 2, 3, 4, 5].map(i => `<button type="button" class="star-btn" data-rating="${i}">⭐</button>`).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Service</label>
                    <div class="rating-input" id="service-rating">
                        ${[1, 2, 3, 4, 5].map(i => `<button type="button" class="star-btn" data-rating="${i}">⭐</button>`).join('')}
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Submit Review</button>
            </form>
        `;

        this.openModal();

        // Handle star ratings
        document.querySelectorAll('.rating-input').forEach(container => {
            container.querySelectorAll('.star-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const rating = btn.dataset.rating;
                    container.querySelectorAll('.star-btn').forEach((b, idx) => {
                        b.textContent = idx < rating ? '⭐' : '☆';
                    });
                    container.dataset.rating = rating;
                });
            });
        });

        document.getElementById('review-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showToast('Thank you! Your review has been submitted.');
            this.closeModal();
        });
    }

    showMyReviews() {
        if (this.state.currentUser.submittedReviews.length === 0) {
            this.showToast('No reviews yet. Start reviewing restaurants!');
            return;
        }

        const reviewsHtml = this.state.currentUser.submittedReviews
            .map(review => this.renderReviewCard(review))
            .join('');

        this.elements.modalBody.innerHTML = `
            <h2 class="modal-title">My Reviews</h2>
            ${reviewsHtml}
            <button class="btn btn-secondary" style="margin-top: var(--spacing-lg);" data-mt-close>Close</button>
        `;

        this.openModal();
    }

    showAbout() {
        this.elements.modalBody.innerHTML = `
            <h2 class="modal-title">About RestaurantMatch</h2>
            <p class="modal-subtitle">Your Personal Restaurant Discovery Assistant</p>
            
            <div style="margin-bottom: var(--spacing-lg);">
                <h3 style="font-weight: 600; margin-bottom: var(--spacing-sm);">Version 1.0</h3>
                <p class="section-subtitle">
                    RestaurantMatch helps you discover and rate restaurants based on your preferences, 
                    budget, and occasion. Get personalized recommendations powered by our smart matching algorithm.
                </p>
            </div>

            <div style="margin-bottom: var(--spacing-lg);">
                <h3 style="font-weight: 600; margin-bottom: var(--spacing-sm);">Features</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: var(--color-text-secondary);">✓ Smart restaurant matching algorithm</li>
                    <li style="padding: 8px 0; color: var(--color-text-secondary);">✓ Detailed ratings and reviews</li>
                    <li style="padding: 8px 0; color: var(--color-text-secondary);">✓ Save your favorite places</li>
                    <li style="padding: 8px 0; color: var(--color-text-secondary);">✓ Filter by cuisine, budget, and more</li>
                    <li style="padding: 8px 0; color: var(--color-text-secondary);">✓ Share reviews and recommendations</li>
                </ul>
            </div>

            <button class="btn btn-secondary" data-mt-close>Close</button>
        `;

        this.openModal();
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RestaurantApp();
});
