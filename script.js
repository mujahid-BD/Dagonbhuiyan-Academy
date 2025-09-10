document.addEventListener('DOMContentLoaded', function() {
    // সাপ্তাহের দিন এবং তারিখ
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const now = new Date();
    const day = days[now.getDay()];
    const date = now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('day-date').textContent = day + ', ' + date;
});