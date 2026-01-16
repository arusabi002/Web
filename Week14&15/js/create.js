const authToken = localStorage.getItem("authToken");

const headerAuth = document.querySelector(".header__auth");

document.querySelector('.button--blue').addEventListener('click', async (event) => {
    event.preventDefault();

    const title = document.querySelector('.name-input').value;
    const content = document.querySelector('.content-input').value;
    const categotyId = document.querySelector('.category-input').value;
    const thumbnail = document.querySelector('.cover-input').files[0];

    if (!title || !categotyId || !content || !thumbnail){
        alert('Пожалуйста, заполните все поля');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categotyId);
    formData.append('thumbnail', thumbnail);

    try {
        const response = await fetch('https://webfinalapi.mobydev.kz/news', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        if(response.ok) {
            alert('Новость успешно добавлена!')
            window.location.href = './index.html';
        } else {
            alert("Ошибка при добавлении новости!")
        }
    } catch (error) {
        console.error('Ошибка', error);
    }
})

async function logoutButton() {
    try {
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
    window.location.href = "./index.html";
}


document.addEventListener('DOMContentLoaded', () => {
    logoutButton()
});