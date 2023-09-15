const queryString = location.search
let param = new URLSearchParams(queryString)
//* Parametro identificador
const dataDetail = param.get("id")
//* Card
const detailCard = document.getElementById('detailCard')
//* Favorite
const biClassFav = document.querySelector(".biFavorites");


const datos = () => {
    fetchData()
    .then(res => res)
    .then(data => {
        const dataEvents = data.events
        const currentDate = data.currentDate

        const detail = dataEvents.find(item => Number(dataDetail) === Number(item._id)) 
        
        renderDetailTemplate(detail, currentDate, detailCard)

        //! Favorites
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        function saveFavoritesToLocalStorage(favorites) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        function favoriteToggleColor(biClassFav, arr) {
            const toggleColor = biClassFav.classList.toggle('biFavRed');
            const cardItem = biClassFav.closest('.card');

            let eventItem = arr.find(ev => Number(cardItem.getAttribute('key')) === ev._id);

            if (toggleColor) {
                favorites.push(eventItem);
            } else {
                favorites = favorites.filter(fav => fav._id !== Number(eventItem._id));
            }

            saveFavoritesToLocalStorage(favorites);
        }

        function addCardFavoriteEvent() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('biFavorite')) {
                    favoriteToggleColor(e.target, dataEvents);
                }
            });
        }

        addCardFavoriteEvent();

        // Función para mostrar eventos aleatorios
        function mostrarEventosAleatorios() {
            const randomEventsContainer = document.querySelector(".random-events");
            
            randomEventsContainer.innerHTML = '';
            // Mezcla el arreglo de eventos para obtener eventos aleatorios
            const eventosAleatorios = mixed(dataEvents).slice(0, 3); // Muestra 3 eventos aleatorios
            
            eventosAleatorios.forEach(item => {
                const eventoElement = document.createElement("div");
                eventoElement.classList.add("random-event");
                eventoElement.innerHTML = `
                <div class="col">
                <div class="card h-100" id="random-event">
                  <img src=${item.image} class="card-img-top" alt=${item.name}>
                  <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.place}</p>
                    <small class="text-body-secondary">Date: ${item.date}</small>
                  </div>
                </div>
              </div>
                `;
                randomEventsContainer.appendChild(eventoElement);
            });
        }

        // Función para mezclar un arreglo de manera aleatoria
        function mixed(array) {
            let currentIndex = array.length, randomIndex, tempValue;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                tempValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = tempValue;
            }

            return array;
        }
        
        // Función para cambiar eventos automáticamente cada 2 segundos (2000 milisegundos)
        function cambiarEventosAutomaticamente() {
            mostrarEventosAleatorios(); // Muestra los eventos iniciales
            setInterval(mostrarEventosAleatorios, 4000);
        }

        // Llama a la función para cambiar eventos automáticamente
        cambiarEventosAutomaticamente();
        })
    .catch(err=> console.log(err))
}

datos()

//*--------------------------------------------

//! Card Template
function createDetailTemplate(item, current){
    let template = ''
    let stateEvent = current < item.date ? 'Coming up' : 'Past Event';
    let colorStyle = stateEvent === 'Past Event' ? 'color: red; border: 2px solid red' : 'color: green; border: 2px solid green';

    template = `
        <div class="card" key=${item._id}>
            <div class="row g-0 align-item-center justify-content-evenly align-content-around">
                <div class="col-md-7">
                    <img
                        src=${item.image}
                        class="img-fluid w-100 h-100"
                        alt=${item.name}
                    >
                </div>
                <div class="col-md-5">
                    <div class="card-body dataBody">
                    <i class="bi bi-heart-fill biFavorite" id="iconfav"></i>
                        <h4 class="card-title text-center">
                            ${item.name}
                        </h4>
                        <ul>
                            <li>Date: <span>${item.date}</span></li>
                            <li>Place: <span>${item.place}</span></li>
                            <li>Capacity: <span>${item.capacity}</span></li>
                            <li>
                                ${item.date < current ? 
                                    `Assistance: <span>${item.assistance}</span>`
                                : `Estimate: <span>${item.estimate}</span>`
                                }
                            </li>
                        </ul>
                        <span class="state" style="${colorStyle}">${stateEvent}</span>
                    </div>
                </div>
            </div>
        </div>
        `
        return template
}

function renderDetailTemplate(item, current, elementHTML) {
    let structure = ''
    structure += createDetailTemplate(item, current)
    elementHTML.innerHTML = structure
    return structure
}

//*--------------------------------------------



