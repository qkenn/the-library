const form = document.getElementById('form'),
  openBtn = document.getElementById('open'),
  formModal = document.getElementById('form-modal');
closeBtn = document.getElementById('close-btn');

const library = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  let isRead = DOMPurify.sanitize(data.get('read_status'));

  addToLibrary(
    title,
    author,
    +pages,
    isRead == 'true' ? (isRead = true) : (isRead = false)
  );

  console.log(library);

  formModal.close();
});

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  library.push(newBook);
}

addToLibrary('Sapiens', 'Yuval Noah Harari', 498, true);
addToLibrary('GenX', 'Batman', 200, false);
addToLibrary('GenY', 'Spider-man', 300, true);

openBtn.addEventListener('click', () => {
  formModal.showModal();
});

closeBtn.addEventListener('click', () => {
  formModal.close();
});
