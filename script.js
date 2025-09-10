document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function(event) {
            event.preventDefault(); // লিংক ক্লিক প্রিভেন্ট করো
            alert('এটা একটা গ্যালারি ইমেজ! পুরো ইমেজ দেখতে ক্লিক করুন।'); // সিম্পল JS ফিচার
        });
    });
});