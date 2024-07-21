const form = document.getElementById('form'),
  openBtn = document.getElementById('open'),
  formModal = document.getElementById('form-modal'),
  closeBtn = document.getElementById('close-btn'),
  bookTemplate = document.getElementById('book-template'),
  booksGrid = document.getElementById('books-grid');

// books collection
let library = [];

// add demo books to collection
addToLibrary('Sapiens', 'Yuval Noah Harari', 400, true);
addToLibrary('GenX', 'Batman', 200, false);
addToLibrary('GenY', 'Spider-Man', 300, true);

// book constructor
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// book toggle prototype function
Book.prototype.toggle = function () {
  this.isRead = !this.isRead;
};

// create and render book card upon form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  // extract and purify form data
  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  let isRead = DOMPurify.sanitize(data.get('read_status'));

  addToLibrary(title, author, pages, isRead == 'true' ? true : false);

  renderBooks(library);

  formModal.close();
});

openBtn.addEventListener('click', () => {
  formModal.showModal();
});

closeBtn.addEventListener('click', () => {
  formModal.close();
});

// add to books collection
function addToLibrary(...book) {
  const newBook = new Book(...book);
  library.push(newBook);
}

// create book card dom element
function createBookCard(book, bookIndex) {
  const clone = bookTemplate.content.cloneNode(true);

  const title = clone.querySelector('.template-title');
  const author = clone.querySelector('.template-author');
  const pages = clone.querySelector('.template-pages');
  const readStatus = clone.querySelector('.template-read-status');
  const template = clone.querySelector('.book-template');
  const deleteBtn = clone.querySelector('.delete-btn');
  const toggleBtn = clone.querySelector('.toggle-btn');

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

  template.dataset.id = bookIndex;

  // template elements isn't availbale in global scope: template haven't initiated
  handleDelete(deleteBtn, bookIndex);
  handleToggle(toggleBtn, bookIndex);

  return clone;
}

// render available books on books collection
function renderBooks(books) {
  booksGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  books.forEach((book, bookIndex) => {
    const clone = createBookCard(book, bookIndex);
    fragment.appendChild(clone);
  });

  booksGrid.appendChild(fragment);
}

// handles book deletion
function handleDelete(deleteBtn, bookIndex) {
  deleteBtn.addEventListener('click', () => {
    library = library.filter((book, index) => index != bookIndex);

    // re-render book cards after deletion
    renderBooks(library);
  });
}

// handles book read toggle
function handleToggle(toggleBtn, bookIndex) {
  toggleBtn.addEventListener('click', () => {
    const book = library.find((book, index) => index == bookIndex);

    book.toggle();

    renderBooks(library);
  });
}

// initial render
renderBooks(library);
