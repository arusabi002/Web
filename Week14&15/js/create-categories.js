const authToken = localStorage.getItem("authToken");

const headerAuth = document.querySelector(".header__auth");

document.querySelector('.js-create-categories').addEventListener('click', async (event) => {
    event.preventDefault();

    const name = document.querySelector('.nameC-input').value.trim();;

    if (!name){
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await fetch('https://webfinalapi.mobydev.kz/category', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({name})
        });

        if(response.ok) {
            alert('Категория успешно добавлена!')
            window.location.href = './categories.html';
        } else {
            alert("Ошибка при добавлении категории!")
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