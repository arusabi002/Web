const BASE_URL = "https://webfinalapi.mobydev.kz"

async function fetchAndRenderCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const newsArray = await response.json();
        document.querySelector('.categories-grid').innerHTML = newsArray.map(categories => `
            <div class="categories-card">
                <h2 class="categories-card__title">${categories.name}</h2>
                <div class="categories-card__actions">
                    <a href="./edit-categories.html&id=${categories.id}" class="button button--blue button--small">
                        Редактировать
                    </a>

                    <button type="button" class="button button--red button--small" onclick="deleteCategories(${categories.id})">
                        Удалить
                    </button>
                </div>
            </div>
            `).join('');
    } catch (error) {
        console.error('Ошибка при получении категорий: ', error);
    }


}

function setupActionButtons() {
    const authToken = localStorage.getItem("authToken");

    const headerAuth = document.querySelector(".header__auth");
    if (authToken) {
        headerAuth.innerHTML = `<button class="button button--blue" onclick="logout()">Выйти</button>`;
    }

    document.querySelectorAll(".categories-card__actions a.button--blue").forEach(link => {
        link.addEventListener("click", event => {
            if (!authToken) {
                event.preventDefault();
                alert("Авторизуйтесь для редактирования.");
            }
        });
    });

    document.querySelectorAll(".categories-card__actions button.button--red").forEach(button => {
        button.addEventListener("click", () => {
            if (!authToken) return alert("Авторизация для удаления.");
            deleteNews(button.getAttribute("onclick").match(/\d+/)[0]);
        });
    });
}

document.addEventListener('DOMContentLoaded', fetchAndRenderCategories);