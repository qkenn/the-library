const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  const isRead = DOMPurify.sanitize(data.get('read_status'));

  console.log(title, author, pages, isRead);
});
