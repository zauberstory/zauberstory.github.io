document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Book Page Navigation
    initBookNavigation();
});

function initBookNavigation() {
    const bookData = window.bookData;
    if (!bookData) return;
    
    let currentPage = 1;
    const totalPages = bookData.totalPages;
    let autoPlayInterval;
    let isAutoPlaying = false;
    
    // DOM Elements
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const autoPlayBtn = document.getElementById('autoPlayToggle');
    const pageElements = document.querySelectorAll('.book-page');
    const thumbnails = document.querySelectorAll('.page-thumb');
    
    // Update display
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    
    // Navigation functions
    function showPage(pageNum) {
        if (pageNum < 1 || pageNum > totalPages) return;
        
        // Hide all pages
        pageElements.forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.querySelector(`[data-page="${pageNum}"]`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
        }
        
        // Update current page
        currentPage = pageNum;
        if (currentPageSpan) currentPageSpan.textContent = currentPage;
        
        // Update button states
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
        
        // Update thumbnails
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index + 1 === currentPage);
        });
        
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function nextPage() {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        } else if (isAutoPlaying) {
            // Auto-play: restart from beginning
            showPage(1);
        }
    }
    
    function prevPage() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    
    // Thumbnail navigation
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showPage(index + 1);
            stopAutoPlay();
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        if (!bookData.autoPlay || totalPages <= 1) return;
        
        isAutoPlaying = true;
        if (autoPlayBtn) {
            autoPlayBtn.textContent = '⏸️ Auto-Play';
            autoPlayBtn.classList.add('text-red-600');
        }
        
        autoPlayInterval = setInterval(() => {
            nextPage();
        }, bookData.autoPlayDelay);
    }
    
    function stopAutoPlay() {
        isAutoPlaying = false;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        if (autoPlayBtn) {
            autoPlayBtn.textContent = '▶️ Auto-Play';
            autoPlayBtn.classList.remove('text-red-600');
        }
    }
    
    function toggleAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
    
    // Auto-play button
    if (autoPlayBtn) {
        autoPlayBtn.addEventListener('click', toggleAutoPlay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextPage();
            stopAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPage();
            stopAutoPlay();
        } else if (e.key === 'Home') {
            e.preventDefault();
            showPage(1);
            stopAutoPlay();
        } else if (e.key === 'End') {
            e.preventDefault();
            showPage(totalPages);
            stopAutoPlay();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes (ignore vertical scrolling)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next page
                nextPage();
            } else {
                // Swipe right - previous page
                prevPage();
            }
            stopAutoPlay();
        }
        
        startX = 0;
        startY = 0;
    });
    
    // Initialize first page
    showPage(1);
}
