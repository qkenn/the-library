const form = document.getElementById('form'),
  openBtn = document.getElementById('open'),
  formModal = document.getElementById('form-modal'),
  closeBtn = document.getElementById('close-btn'),
  bookTemplate = document.getElementById('book-template'),
  booksGrid = document.getElementById('books-grid');

// books collection
const library = [];

// book constructor
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// create and render book card upon form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  // extract and purify form data
  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  let isRead = DOMPurify.sanitize(data.get('read_status'));

  const newBook = {
    title,
    author,
    pages,
    isRead: isRead == 'true' ? (isRead = true) : (isRead = false),
  };

  addToLibrary(newBook);

  renderBook(newBook);

  formModal.close();
});

openBtn.addEventListener('click', () => {
  formModal.showModal();
});

closeBtn.addEventListener('click', () => {
  formModal.close();
});

// add to books collection
function addToLibrary(...params) {
  const newBook = new Book(...params);
  library.push(newBook);
}

// render single book card
function renderBook(book) {
  const bookCard = createBookCard(book);
  booksGrid.appendChild(bookCard);
}

// create book card dom element
function createBookCard(book) {
  const clone = bookTemplate.content.cloneNode(true);

  const title = clone.querySelector('.template-title');
  const author = clone.querySelector('.template-author');
  const pages = clone.querySelector('.template-pages');
  const readStatus = clone.querySelector('.template-read-status');
  const template = clone.querySelector('.book-template');

  book.title ? (title.textContent = book.title) : (title.textContent = '');
  book.author
    ? (author.textContent = `By ${book.author}`)
    : (author.textContent = '');
  book.pages
    ? (pages.textContent = `${book.pages} pages.`)
    : (pages.textContent = '');

  readStatus.textContent = book.isRead
    ? '✅ You have read this.'
    : "❎ You haven't read this yet.";

  book.isRead
    ? (template.style.borderBottom = '10px solid rgb(44, 189, 0)')
    : (template.style.borderBottom = '10px solid rgb(255, 174, 0)');

  return clone;
}

// add demo books
addToLibrary('Sapiens', 'Yuval Noah Harari', 498, true);
addToLibrary('GenX', 'Batman', 200, false);
addToLibrary('GenY', 'Spider-man', 300, true);

// render available books on books collection
function renderBooks(books) {
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const clone = createBookCard(book);
    fragment.appendChild(clone);
  });

  booksGrid.appendChild(fragment);
}

// initial render
renderBooks(library);
