//* Cards
const colCard = document.getElementById("colCard");

//* Checkboxs & Search Content
const contentCheck = document.getElementById("contenCheck");

//* Favorite
const biClassFav = document.querySelector(".biFavorites");

//* Events Lengths
const cardsLength = document.getElementById("cardsLength");
const state = document.querySelectorAll('.state');

const datos = () => {
    fetchData()
    .then(res=> res)
    .then(data => {
            const dataEvents = data.events
            const currentDate = data.currentDate

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            renderCards(dataEvents, currentDate, colCard);

            //*----------------------------------------

            const filterCategories = [
                ...new Set(dataEvents.map((item) => item.category)),
            ].sort();

            renderChecks(filterCategories, contentCheck);
            
            renderSearch(contentCheck);

            //*----------------------------------------

            const handlerSubmit = (e) => {
                e.preventDefault();
                contentCheck.addEventListener("input", () =>
                    handlerChange(dataEvents, currentDate, colCard)
                );
            };

            contentCheck.addEventListener("change", () =>
                handlerChange(dataEvents,currentDate, colCard)
            );
            contentCheck.addEventListener("submit", handlerSubmit);

            //*----------------------------------------

           //! Favorites
            function favoriteToggleColor(biClassFav, dataEvents) {
                const toggleColor = biClassFav.classList.toggle('biFavRed');
                const cardItem = biClassFav.closest('.card');
                const favEvent = document.getElementById('fav-cards');

                if (!cardItem) return; // Si no hay una tarjeta me voy

                const eventId = cardItem.getAttribute('key');
                const eventItem = dataEvents.find(ev => ev._id === Number(eventId));
                const isFavorite = favorites.some(fav => fav._id === Number(eventId));

                if (toggleColor && eventItem && !isFavorite) {
                    favorites.push(eventItem);
                } else if (!toggleColor && isFavorite) {
                    favorites = favorites.filter(fav => fav._id !== Number(eventId));
                }

                saveFavoritesToLocalStorage();
                renderCardsFavorite(favorites, currentDate, favEvent);
 
                if (favorites.length === 0) {
                    const asideFavorite = document.getElementById("fav-aside");
                    asideFavorite.classList.remove("open");
                }
                return favorites;
            }

            function saveFavoritesToLocalStorage() {
                localStorage.setItem("favorites", JSON.stringify(favorites));
            }

            function addCardFavoriteEvent() {
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('biFavorite')) {
                        favoriteToggleColor(e.target, dataEvents);
                    }
                });
            }
            addCardFavoriteEvent();

            //* Aside Favorites
            function asideToggleOpen(elementHTML) {
                let isOpen = false;

                const toggleOpen = () => {
                    isOpen = !isOpen;
                    elementHTML.classList.toggle("open", isOpen);
                    elementHTML.classList.toggle("closed", !isOpen);
                };
                return toggleOpen;
            }

            function showFavoriteAside() {
                const asideFavorite = document.getElementById("fav-aside");
                const showAside = document.getElementById("show-fav");
                const favEvent = document.getElementById("fav-cards");
                let toggleAside = asideToggleOpen(asideFavorite);

                if (favorites.length > 0) {
                    asideFavorite.classList.add("open");
                    renderCardsFavorite(favorites, currentDate, favEvent);
                }

                showAside.addEventListener("click", toggleAside);
            }

            showFavoriteAside();


            //* Events Lengths
            let dataLength = dataEvents.length;
            cardsLength.innerHTML = dataLength;
        })
        .catch((err) => console.log(err));
};

datos();


 //! Cards Template (elementHTML: colCard)
 const createTemplate = (item, current) => {
    let template = "";
    let stateEvent = current < item.date ? 'Coming up' : 'Past Event';
    let colorStyle = stateEvent === 'Past Event' ? 'color: red; border: 2px solid red' : 'color: green; border: 2px solid green';

    template += `<div class="col-md-6">
            <div class="card h-100" key=${item._id} id="card">
                <img src=${item.image} class="card-img-top" alt="imagen 2">
                <i class="bi bi-heart-fill biFavorite" id="iconfav"></i>
                <span class="state" style="${colorStyle}">${stateEvent}</span>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">
                        ${item.description}
                    </p>
                </div>
                <div class="hstack gap-3 text-center px-2 py-3">
                    <div class="p-2 fw-bold">$ ${item.price}</div>
                    <div class="p-2 ms-auto">
                    <a href="details.html?id=${item._id}">Details</a>      
                    </div>
                </div>
            </div>
        </div>`;
    return template;
};

const renderCards = (array, current, elementHTML) => {
    let structure = "";
    array.forEach((item) => {
        structure += createTemplate(item, current);
    });
    elementHTML.innerHTML = structure;
    return structure;
};

//! Checkbox (elementHTML: contentCheck)
const createCheckTemplate = (item) => {
    let template = "";
    template = `
            <div class="form-check-inline px-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="${item}"
                    value="${item}"
                >
                <label class="form-check-label" for=${item}
                    >${item}</label
                >
            </div>
        `;
    return template;
};

const renderChecks = (array, elementHTML) => {
    let structure = "";
    array.forEach((item) => {
        structure += createCheckTemplate(item);
        elementHTML.innerHTML = structure;
    });
    return structure;
};

//! Search Template
const createSearchTemplate = () => {
    let template = "";
    template += `
            <form class="d-inline-block" role="search" method="post">
                <div class="input-group">
                    <input
                        class="form-control"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        name="search"
                        value=""
                    >
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                </div>
            </form>
        `;
    return template;
};

const renderSearch = (elementHTML) => {
    let structure = "";
    structure += createSearchTemplate();
    elementHTML.innerHTML += structure; // concateno con la existente
    return structure;
};

//! Filters & Listeners
function cheksFiltered(arr) {
    // checks seleccionados
    const nodeListChecks = document.querySelectorAll('input[type="checkbox"]:checked');

    //paso a array
    let arrChecks = Array.from(nodeListChecks).map((input) => input.value);

    //filter
    let itemsFiltered = arrChecks.length > 0
            ? arr.filter((item) => arrChecks.includes(item.category))
            : arr;
    return itemsFiltered;
}

function searchFiltered(arr) {
    // capturo el valor
    const inputValue = document.querySelector(
        'input[type="search"]'
    );
    const valueSearch = inputValue.value.toLowerCase();
    
    const inputSearch = valueSearch !== ""
            ? arr.filter(item =>(item.name).toLowerCase().includes(valueSearch))
            : arr;

    return inputSearch;
}

function combineFilters(arr, current) {
    // me traigo las funciones de filtrado
    let checksFilterResults = cheksFiltered(arr);
    let searchFilterResult = searchFiltered(arr);

    let combined = checksFilterResults.filter((item) =>
        searchFilterResult.includes(item)
    );

    let cardsLength = document.getElementById("cardsLength");
    let dataLength = combined.length;
    cardsLength.innerHTML = dataLength;

    return combined;
}

const handlerChange = (arr,current, elementHTML) => {
    let combineResults = combineFilters(arr);
    if (combineResults.length === 0) {
        swal("Event is not found, try with other name...");
    }
    renderCards(combineResults,current, elementHTML);
};

//! Favorite

function createTemplateFavorite(item, current) {
    let stateEvent = current < item.date ? 'Coming up' : 'Past Event';
    let colorStyle = stateEvent === 'Past Event' ? 'color: red; border: 2px solid red' : 'color: green; border: 2px solid green';

    let template = `
        <li>
            <div class="card h-100" key=${item._id}>
                <img src=${item.image} class="card-img-top" alt="imagen 2">
                <i class="bi bi-heart-fill biFavorite biFavRed" id="iconfav"></i>
                <span class="state" style="${colorStyle}">${stateEvent}</span>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">
                        ${item.description}
                    </p>
                </div>
                <div class="hstack gap-3 text-center px-2 py-3">
                    <div class="p-2 fw-bold">$ ${item.price}</div>
                    <div class="p-2 ms-auto">
                        <a href="../details.html?id=${item._id}">Details</a>      
                    </div>
                </div>
            </div>
        </li>
    `;

    return template;
}

function renderCardsFavorite(array, current, elementHTML) {
    let structure = "";
    array?.forEach((item) => {
        structure += createTemplateFavorite(item, current);
    });
    
    elementHTML.innerHTML = structure;
    return structure
}