document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // হ্যামবার্গার মেনু টগল
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // গ্যালারি ইমেজ ক্লিক
    galleryImages.forEach(img => {
        img.addEventListener('click', function(event) {
            event.preventDefault();
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
        });
    });

    // লাইটবক্স বন্ধ
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });

    // স্মুথ স্ক্রলিং
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
            navMenu.classList.remove('active'); // মোবাইলে মেনু বন্ধ
        });
    });

    // ফর্ম সাবমিশন
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('মেসেজ পাঠানো হয়েছে! (এটা শুধু ফ্রন্টএন্ড ডেমো)');
        this.reset();
    });
});