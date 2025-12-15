document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // News: show more / show less (classic academic page behavior)
    const newsList = document.getElementById('newsList');
    const newsToggle = document.getElementById('newsToggle');
    if (!newsList || !newsToggle) return;

    const items = Array.from(newsList.querySelectorAll('li'));
    const initialCount = 4;

    if (items.length <= initialCount) {
        newsToggle.style.display = 'none';
        return;
    }

    let collapsed = true;

    const applyState = () => {
        items.forEach((item, index) => {
            item.style.display = collapsed && index >= initialCount ? 'none' : '';
        });
        newsToggle.textContent = collapsed ? 'Show more' : 'Show less';
        newsToggle.setAttribute('aria-expanded', String(!collapsed));
    };

    newsToggle.addEventListener('click', (event) => {
        event.preventDefault();
        collapsed = !collapsed;
        applyState();
    });

    applyState();
});
