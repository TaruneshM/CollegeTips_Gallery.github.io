// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // Animate toggle
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 200);
});

// Filter Gallery
const filterChips = document.querySelectorAll('.filter-chips .chip');
const galleryItems = document.querySelectorAll('.grid-item');

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        // Update active chip
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // Filter items
        const filter = chip.getAttribute('data-filter');
        galleryItems.forEach(item => {
            const matches = filter === 'all' || item.getAttribute('data-category') === filter;
            item.style.display = matches ? 'block' : 'none';

            // Re-trigger animation
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.6s ease';
            }, 10);
        });
    });
});

// FAB Button Scroll To Top
const fab = document.querySelector('.fab');
window.addEventListener('scroll', () => {
    fab.classList.toggle('visible', window.scrollY > 300);
});

fab.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Like Button Functionality
document.querySelectorAll('.like-btn').forEach(button => {
    // Check for saved likes
    const cardId = button.closest('.grid-item').getAttribute('data-category') + '-' + 
                  button.closest('.gallery-card').querySelector('h3').textContent.replace(/\s+/g, '-').toLowerCase();
    const savedLike = localStorage.getItem(cardId);
    
    if (savedLike === 'liked') {
        button.classList.add('liked');
        const icon = button.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas');
    }

    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        const count = this.querySelector('.like-count');
        
        // Toggle like state
        this.classList.toggle('liked');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        
        // Update count
        const currentCount = parseInt(count.textContent);
        count.textContent = this.classList.contains('liked') ? currentCount + 1 : currentCount - 1;
        
        // Save to localStorage
        const cardId = this.closest('.grid-item').getAttribute('data-category') + '-' + 
                      this.closest('.gallery-card').querySelector('h3').textContent.replace(/\s+/g, '-').toLowerCase();
        localStorage.setItem(cardId, this.classList.contains('liked') ? 'liked' : 'unliked');
        
        // Animation
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 300);
    });
});

// Auto-generate video thumbnails from first frame
document.querySelectorAll('video').forEach(video => {
    // Skip if already has a poster
    if (video.hasAttribute('poster')) return;
    
    // Capture first frame as thumbnail
    video.addEventListener('loadedmetadata', function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Seek to beginning and capture frame
        this.currentTime = 0.1;
        this.addEventListener('seeked', function() {
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            this.setAttribute('poster', canvas.toDataURL());
        }, { once: true });
    });
});