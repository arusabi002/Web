function getNewsIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const BASE_URL = "https://webfinalapi.mobydev.kz"

async function deleteNews(id) {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("Авторизуйтесь для удаления!");
        return;
    }

    const isConfirmed = confirm("Вы уверены, что хотите удалить данную новость?");
    if (!isConfirmed) return;

    try {
        const responce = await fetch(`${BASE_URL}/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (responce.ok) {
            alert('Новость успешно удалена.');
            window.location.href = "./index.html";
        } else {
            alert('Ошибка при удалении новости.')
        }
    } catch (error) {
        console.error('Ошибка', error);
    }
}

async function fetchAndRenderNewsById(newsId) {
    try {
        const response = await fetch(`${BASE_URL}/news/${newsId}`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const news = await response.json();

        document.querySelector('.news-title').textContent = news.title;
        document.querySelector('.news-author').textContent = news.author.name || 'Неизвестный автор';
        document.querySelector('.news-date').textContent = new Date(news.createdAt).toLocaleDateString() + "г.";
        document.querySelector('.news-category').textContent = news.category.name;
        document.querySelector('.news-image').src = `${BASE_URL}${news.thumbnail}`;
        document.querySelector('.news-content').textContent = news.content;

        const actionButtons = document.querySelector('.news-actionButtons')
        actionButtons.innerHTML = `
            <a href="./edit.html?id=${news.id}" class="news-edit">
                <img src="./img/pencil-01.svg" alt="pencil icon">
            </a>
            <button onclick="deleteNews(${news.id})" class="news-delete">
                <img src="./img/trash-04.svg" alt="delete icon">
            </button>`
        setupActionButtons();
    } catch (error) {
        console.error('Ошибка при получении новости: ', error);
    }


}


async function setupActionButtons() {
    try {
        document.querySelectorAll(".news-actionButtons a.news-edit").forEach(link => {
            link.addEventListener("click", event => {
                if (!authToken) {
                    event.preventDefault();
                    alert("Авторизуйтесь для редактирования.");
                }
            });
        });

        document.querySelectorAll(".news-actionButtons a.news-delete").forEach(button => {
            button.addEventListener("click", () => {
                if (!authToken) return alert("Авторизация для удаления.");
                deleteNews(button.getAttribute("onclick").match(/\d+/)[0]);
            });
        });
        const authToken = localStorage.getItem("authToken");

        const headerAuth = document.querySelector(".header__auth");

        const response = await fetch(`https://webfinalapi.mobydev.kz/user/profile`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const user = await response.json();
        if (authToken) {
            headerAuth.innerHTML = `
        <div class="user">
            <div class="user__avatar">
                <img src="./img/Frame 5.svg" alt="Аватар">
            </div>
            <p class="user__name">${user.name || 'Неизвестный автор'}</p>
        </div>
        <button class="button button--red" onclick="logout()">Выйти</button>`;
        }


    } catch (error) {
        console.error('Ошибка при получении новости: ', error);
    }

}


function logout() {
    localStorage.removeItem("authToken");
    window.location.reload();
}


document.addEventListener('DOMContentLoaded', () => {

    const newsId = getNewsIdFromUrl();
    if (newsId) {
        fetchAndRenderNewsById(newsId);
    } else {
        console.error('ID новости не найден в URL');
    }
});