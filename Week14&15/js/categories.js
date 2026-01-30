const BASE_URL = "https://webfinalapi.mobydev.kz"

async function deleteCategories(id) {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("Авторизуйтесь для удаления!");
        return;
    }

    const isConfirmed = confirm("Вы уверены, что хотите удалить данную категорию?");
    if (!isConfirmed) return;

    try {
        const responce = await fetch(`${BASE_URL}/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (responce.ok) {
            alert('Категория успешно удалена.');
            fetchAndRenderCategories();
        } else {
            alert('Ошибка при удалении категории.')
        }
    } catch (error) {
        console.error('Ошибка', error);
    }
}

async function fetchAndRenderCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const newsArray = await response.json();
        document.querySelector('.categories-grid').innerHTML = newsArray.map(categories => `
            <div class="categories-card">
                <h2 class="categories-card__title">${categories.name}</h2>
                <div class="categories-card__actions">
                    <a href="" class="button button--blue button--small">
                        Редактировать
                    </a>

                    <button type="button" class="button button--red button--small" onclick="deleteCategories(${categories.id})">
                        Удалить
                    </button>
                </div>
            </div>
            `).join('');
        setupActionButtons();
    } catch (error) {
        console.error('Ошибка при получении категорий: ', error);
    }


}

async function setupActionButtons() {
    try {
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

        document.querySelectorAll(".categories-card__actions a.button--blue").forEach(link => {
            link.addEventListener("click", event => {
                if (!authToken) {
                    event.preventDefault();
                    alert("Авторизуйтесь для редактирования.");
                }
                alert("Упс! Пока не работает >.<")
            });
        });

        document.querySelectorAll(".categories-card__actions button.button--red").forEach(button => {
            button.addEventListener("click", () => {
                if (!authToken) return alert("Авторизация для удаления.");
                deleteCategories(button.getAttribute("onclick").match(/\d+/)[0]);
            });
        });
    } catch (error) {
        console.error('Ошибка при получении категории: ', error);
    }
}

function displayCreateButton() {
    if (localStorage.getItem("authToken")) {
        const createButton = document.createElement("button");
        createButton.className = "button button--green";
        createButton.textContent = "+";
        createButton.onclick = () => (window.location.href = "./create-categories.html");
        document.querySelector('.categories-grid').before(createButton);
    }
}

function logout() {
    localStorage.removeItem("authToken");
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderCategories();
    displayCreateButton();
});