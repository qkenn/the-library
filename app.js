const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  console.log('form hooked');
});
