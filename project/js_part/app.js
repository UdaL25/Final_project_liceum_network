import { api } from './api.js';
let currentPage = 1;
const LIMIT = 5;

const pages = {
  login: document.getElementById('loginPage'),
  register: document.getElementById('registerPage'),
  feed: document.getElementById('feedPage')
};
const navbar = document.getElementById('navbar');

function showPage(pageName) {
  Object.values(pages).forEach(el => el.classList.add('hidden'));
  pages[pageName].classList.remove('hidden');
  navbar.classList.toggle('hidden', pageName === 'login' || pageName === 'register');
}
document.getElementById('toRegister').onclick = (e) => { e.preventDefault(); showPage('register'); };
document.getElementById('toLogin').onclick = (e) => { e.preventDefault(); showPage('login'); };
document.getElementById('logoutBtn').onclick = () => { showPage('login'); };
document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  try {
    await api.login(email, pass);
    showPage('feed');
    loadPosts();
  } catch (err) {
    document.getElementById('loginMsg').textContent = err.message;
    document.getElementById('loginMsg').className = 'msg error';
  }
};

document.getElementById('registerForm').onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;
  try {
    await api.register(name, email, pass);
    showPage('login');
  } catch (err) {
    document.getElementById('regMsg').textContent = err.message;
    document.getElementById('regMsg').className = 'msg error';
  }
};

async function loadPosts() {
  const data = await api.getPosts(currentPage, LIMIT);
  const container = document.getElementById('postsList');
  container.innerHTML = data.posts.map(p => 
    `<div class="post"><b>${p.author}</b> <small>${p.date}</small><p>${p.text}</p></div>`
  ).join('');
  
  document.getElementById('pageInfo').textContent = data.page;
  document.getElementById('prevBtn').disabled = data.page === 1;
  document.getElementById('nextBtn').disabled = data.page * LIMIT >= data.total;
}
document.getElementById('prevBtn').onclick = () => { if (currentPage > 1) { currentPage--; loadPosts(); } };
document.getElementById('nextBtn').onclick = () => { currentPage++; loadPosts(); };

showPage('login');