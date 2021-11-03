const lorem100 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec imperdiet id nulla in euismod. Donec et lacus in magna fringilla malesuada. Maecenas eu odio lacus. In nec ipsum eget est volutpat sollicitudin in nec tellus. Mauris vitae odio in metus hendrerit lacinia. Fusce euismod nunc nisi, efficitur congue diam lacinia a. Etiam sollicitudin, orci sed scelerisque eleifend, mauris est finibus tellus, et suscipit metus risus quis lorem. Fusce ut nunc at eros faucibus lacinia. Quisque vel quam tortor. Pellentesque ullamcorper semper orci, non convallis dolor condimentum vitae. Mauris at turpis a quam commodo ultrices. Sed malesuada, magna venenatis luctus congue.`;

let loadingTimeoutId; // track loading setTimeout to allow clearing

document.querySelectorAll('[role="tab"]').forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    
    const loadingTab = document.querySelector('[data-loading]');

    // cancel loading if clicked again
    if (loadingTab) {
      clearTimeout(loadingTimeoutId);
      loadingTab.removeAttribute('data-loading');
    }
    if (loadingTab === tab) {
      return;
    }

    tab.setAttribute('data-loading', 'true');
    
    // load page for 2 seconds
    loadingTimeoutId = setTimeout(() => {
      const _activeTab = document.querySelector('[aria-selected="true"]');
      const _loadingTab = document.querySelector('[data-loading]');
      _activeTab.removeAttribute('aria-selected');
      _loadingTab.removeAttribute('data-loading');
      tab.setAttribute('aria-selected', 'true');
      document.querySelector('.content p').innerHTML = `Page ${index + 1} content\n${lorem100}`;
    }, 2000);
  });
});

document.querySelector('.content p').innerHTML = `Page 1 content\n${lorem100}`;