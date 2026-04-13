document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky Navbar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link highlighting based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });

    // Menu Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuSections = document.querySelectorAll('.menu-section');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchInput = document.getElementById('menuSearch');
    const vegToggle = document.getElementById('vegOnlyToggle');
    const nonVegToggle = document.getElementById('nonVegOnlyToggle');

    function filterMenu() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const showVegOnly = vegToggle ? vegToggle.checked : false;
        const showNonVegOnly = nonVegToggle ? nonVegToggle.checked : false;
        const activeCategoryBtn = document.querySelector('.filter-btn.active');
        const targetCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-filter') : 'all';

        // Filter sections by category button
        menuSections.forEach(section => {
            if (targetCategory === 'all' || section.getAttribute('id') === targetCategory) {
                section.style.display = 'block'; // Reset to default block display
                
                // Now check items inside this section
                let hasVisibleItems = false;
                const itemsInSection = section.querySelectorAll('.menu-item');
                itemsInSection.forEach(item => {
                    const title = item.querySelector('h4').textContent.toLowerCase();
                    const desc = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : "";
                    const isVeg = item.querySelector('.veg-icon') !== null;
                    const isNonVeg = item.querySelector('.nonveg-icon') !== null;
                    
                    const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
                    let matchesToggle = true;
                    if (showVegOnly && !isVeg) matchesToggle = false;
                    if (showNonVegOnly && !isNonVeg) matchesToggle = false;

                    if (matchesSearch && matchesToggle) {
                        item.style.display = 'flex'; // Ensure flex since that's typical for the flip cards if defined, else empty string
                        item.style.display = '';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Hide section if no items match the search/toggles in it
                if (!hasVisibleItems) {
                    section.style.display = 'none';
                }

            } else {
                section.style.display = 'none';
            }
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMenu();
            });
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterMenu);
    
    if (vegToggle) vegToggle.addEventListener('change', () => {
        if (vegToggle.checked && nonVegToggle) nonVegToggle.checked = false; // mutually exclusive
        filterMenu();
    });
    
    if (nonVegToggle) nonVegToggle.addEventListener('change', () => {
        if (nonVegToggle.checked && vegToggle) vegToggle.checked = false; // mutually exclusive
        filterMenu();
    });

    // --- Offers Page Logic ---
    const btnGridView = document.getElementById('btnGridView');
    const btnPlateView = document.getElementById('btnPlateView');
    const sadhyaGrid = document.getElementById('sadhyaGrid');
    const sadhyaPlate = document.getElementById('sadhyaPlate');
    const expandMenuBtn = document.getElementById('expandMenuBtn');
    const bgMusicToggle = document.getElementById('bgMusicToggle');
    const festiveAudio = document.getElementById('festiveAudio');

    // View Toggles
    if (btnGridView && btnPlateView) {
        btnGridView.addEventListener('click', () => {
            btnGridView.classList.add('active');
            btnPlateView.classList.remove('active');
            sadhyaGrid.style.display = 'grid';
            sadhyaPlate.style.display = 'none';
            if (expandMenuBtn) expandMenuBtn.style.display = 'inline-block';
        });

        btnPlateView.addEventListener('click', () => {
            btnPlateView.classList.add('active');
            btnGridView.classList.remove('active');
            sadhyaGrid.style.display = 'none';
            sadhyaPlate.style.display = 'block';
            if (expandMenuBtn) expandMenuBtn.style.display = 'none'; // hide expand btn in plate view
        });
    }

    // Expand/Collapse Menu
    if (expandMenuBtn) {
        let isExpanded = false;
        expandMenuBtn.addEventListener('click', () => {
            const hiddenItems = sadhyaGrid.querySelectorAll('.grid-item-row');
            isExpanded = !isExpanded;
            
            hiddenItems.forEach((item, index) => {
                if (index >= 10) {
                    if (isExpanded) {
                        item.classList.remove('hidden-item');
                    } else {
                        item.classList.add('hidden-item');
                    }
                }
            });

            if (isExpanded) {
                expandMenuBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Show Less';
            } else {
                expandMenuBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> View Full 26 Items';
                // Scroll back up slightly
                document.querySelector('.sadhya-details').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Background Music Toggle
    if (bgMusicToggle && festiveAudio) {
        let isPlaying = false;
        
        const playMusic = () => {
            festiveAudio.play().then(() => {
                isPlaying = true;
                bgMusicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                bgMusicToggle.style.background = 'var(--maroon)';
            }).catch(e => {
                console.log("Autoplay blocked by browser. User interaction required.");
            });
        };

        const pauseMusic = () => {
            festiveAudio.pause();
            isPlaying = false;
            bgMusicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
            bgMusicToggle.style.background = 'rgba(255,255,255,0.1)';
        };

        bgMusicToggle.addEventListener('click', () => {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });

        // Attempt to auto-play after 30 seconds
        setTimeout(() => {
            if (!isPlaying) {
                playMusic();
            }
        }, 30000);
    }

});

