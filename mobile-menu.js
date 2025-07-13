// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const navbar = document.querySelector('#navbar');
    const body = document.body;
    
    // Create mobile menu button if it doesn't exist
    if (!mobileMenuBtn) {
        const header = document.querySelector('#header');
        if (header) {
            const menuButton = document.createElement('div');
            menuButton.id = 'mobile-menu-btn';
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            menuButton.style.cssText = `
                display: none;
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24px;
                cursor: pointer;
                color: #333;
            `;
            header.appendChild(menuButton);
            
            // Add mobile menu styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    #mobile-menu-btn {
                        display: block !important;
                    }
                    
                    #navbar {
                        position: fixed;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100vh;
                        background: white;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        transition: left 0.3s ease;
                        z-index: 1000;
                    }
                    
                    #navbar.active {
                        left: 0;
                    }
                    
                    #navbar li {
                        margin: 20px 0;
                    }
                    
                    #navbar li a {
                        font-size: 20px;
                        color: #333;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add click functionality
            menuButton.addEventListener('click', function() {
                navbar.classList.toggle('active');
                body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
            });
            
            // Close menu when clicking on a link
            const navLinks = navbar.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navbar.classList.remove('active');
                    body.style.overflow = 'auto';
                });
            });
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});