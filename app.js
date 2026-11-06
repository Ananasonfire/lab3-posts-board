'use strict';

const loadPostsBtn = document.getElementById('load-posts-btn');
const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const createPostBtn = document.getElementById('create-post-btn');
const messagesArea = document.getElementById('messages');

const GET_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
const CREATE_POST_URL = 'https://jsonplaceholder.typicode.com/posts';

function showMessage(text, type) {
    messagesArea.textContent = text;
    messagesArea.className = 'messages ' + type;
}

function getErrorMessage(error) {
    if (error instanceof TypeError) {
        return 'Сетевая ошибка: не удалось связаться с сервером. ' +
            'Проверьте подключение к интернету и попробуйте ещё раз.';
    }
    return error.message;
}

function renderPost(post) {
    const card = document.createElement('article');
    card.className = 'post-card';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const text = document.createElement('p');
    text.textContent = post.body;

    card.append(title, text);
    postsList.append(card);
}

async function loadPosts() {
    loadPostsBtn.disabled = true;
    postsList.textContent = '';
    showMessage('Загрузка публикаций…', 'info');

    try {
        const response = await fetch(GET_POSTS_URL);

        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }

        const posts = await response.json();
        posts.forEach(renderPost);

        showMessage('Публикации загружены: ' + posts.length + ' шт.', 'success');
    } catch (error) {
        showMessage('Не удалось загрузить публикации. ' + getErrorMessage(error), 'error');
    } finally {
        loadPostsBtn.disabled = false;
    }
}

loadPostsBtn.addEventListener('click', loadPosts);

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (title === '' || body === '') {
        showMessage('Заполните оба поля: заголовок и текст публикации.', 'error');
        return;
    }

    createPostBtn.disabled = true;
    showMessage('Отправка публикации…', 'info');

    try {
        const response = await fetch(CREATE_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }

        const createdPost = await response.json();
        showMessage('Публикация успешно создана! ID: ' + createdPost.id +
            ', заголовок: «' + createdPost.title + '»', 'success');

        postForm.reset();
    } catch (error) {
        showMessage('Не удалось создать публикацию. ' + getErrorMessage(error), 'error');
    } finally {
        createPostBtn.disabled = false;
    }
});
