//* Cards
const colCard = document.getElementById("colCard");
const cardsLength = document.getElementById("cardsLength");
//* Checkboxs & Search Content
const contentCheck = document.getElementById("contenCheck"); 

const datos = () => {
    
    fetchData()
    .then((res) => res.events)
    .then((data) => {
            console.log("data >> ", data);
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            renderCards(data, colCard);

            //*----------------------------------------

            const filterCategories = [
                ...new Set(data.map((item) => item.category)),
            ].sort();

            renderChecks(filterCategories, contentCheck);
            
            renderSearch(contentCheck);

            //*----------------------------------------

            const handlerSubmit = (e) => {
                e.preventDefault();
                contentCheck.addEventListener("input", () =>
                    handlerChange(data, colCard)
                );
            };

            contentCheck.addEventListener("change", () =>
                handlerChange(data, colCard)
            );
            contentCheck.addEventListener("submit", handlerSubmit);

            //*----------------------------------------

           //! Favorites
            
            function favoriteToggleColor(biClassFav, data) {
                const toggleColor = biClassFav.classList.toggle('biFavRed');
                const cardItem = biClassFav.closest('.card');
                const favEvent = document.getElementById('fav-cards');

                if (!cardItem) return; // Si no hay una tarjeta me voy

                const eventId = cardItem.getAttribute('key');
                const eventItem = data.find(ev => ev._id === Number(eventId));
                const isFavorite = favorites.some(fav => fav._id === Number(eventId));

                if (toggleColor && eventItem && !isFavorite) {
                    favorites.push(eventItem);
                } else if (!toggleColor && isFavorite) {
                    favorites = favorites.filter(fav => fav._id !== Number(eventId));
                }

                saveFavoritesToLocalStorage();
                renderCardsFavorite(favorites, favEvent);

                if (favorites.length === 0) {
                    const asideFavorite = document.getElementById("fav-aside");
                    asideFavorite.classList.remove("open");
                }

                return favorites;
            }

            function saveFavoritesToLocalStorage() {
                localStorage.setItem("favorites", JSON.stringify(favorites));
            }

            function addCardFavoriteEvent(data) {
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('biFavorite')) {
                        favoriteToggleColor(e.target, data);
                    }
                });
            }
            addCardFavoriteEvent(data);

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
                    renderCardsFavorite(favorites, favEvent);
                }

                showAside.addEventListener("click", toggleAside);
            }

            function createTemplateFavorite(item) {
                const template = `
                    <li>
                        <div class="card h-100" key=${item._id} data-favorite="true">
                            <img src=${item.image} class="card-img-top" alt="imagen 2">
                            <i class="bi bi-heart-fill biFavorite biFavRed" id="iconfav"></i>
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
                    </li>
                `;
                return template;
            }

            function renderCardsFavorite(array, elementHTML) {
                let structure = "";
                array?.forEach((item) => {
                    structure += createTemplateFavorite(item);
                });
                elementHTML.innerHTML = structure;
                return structure
            }
            showFavoriteAside();

            function classFavoriteHome() {
                const favEvent = document.getElementById('fav-cards');
                const cards = colCard.querySelectorAll('.card');
            
                cards.forEach((card) => {
                    const eventId = card.getAttribute('key');
                    const isFavorite = favorites.some((fav) => fav._id === Number(eventId));
                    const heartIcon = card.querySelector('.biFavorite');
            
                    if (isFavorite) {
                        heartIcon.classList.add('biFavRed');
                    } else {
                        heartIcon.classList.remove('biFavRed');
                    }
                })

                renderCardsFavorite(favorites, favEvent);
            }
            classFavoriteHome()

            //* Events Lengths

            let dataLength = data.length;
            cardsLength.innerHTML = dataLength;
        })
        .catch((err) => console.log(err));
};

datos();

 //! Cards Template (elementHTML: colCard)
 const createTemplate = (item) => {
    let template = "";
    template += `<div class="col-md-6 px-2">
            <div class="card h-100" key=${item._id} data-favorite="false">
                <img src=${item.image} class="card-img-top" alt="imagen 2">
                <i class="bi bi-heart-fill biFavorite" id="iconfav"></i>
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

const renderCards = (array, elementHTML) => {
    let structure = "";
    array.forEach((item) => {
        structure += createTemplate(item);
        elementHTML.innerHTML = structure;
    });
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
    const nodeListChecks = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );

    //paso a array
    let arrChecks = Array.from(nodeListChecks).map(
        (input) => input.value
    );

    //filter
    let itemsFiltered =
        arrChecks.length > 0
            ? arr.filter((item) =>
                arrChecks.includes(item.category))
            : arr;
    return itemsFiltered;
}

function searchFiltered(arr) {
    // capturo el valor
    const inputValue = document.querySelector(
        'input[type="search"]'
    );
    const valueSearch = inputValue.value.toLowerCase();
    // la primera con mayuscula
    const normalizedValue =
        valueSearch.charAt(0).toUpperCase() +
            valueSearch.slice(1) || valueSearch;
    // filter
    let inputSearch =
        normalizedValue !== ""
            ? arr.filter(item =>item.name.includes(normalizedValue))
            : arr;

    return inputSearch;
}

function combineFilters(arr) {
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

const handlerChange = (arr, elementHTML) => {
    let combineResults = combineFilters(arr);
    if (combineResults.length === 0) {
        swal("Event is not found, try with other name...");
    }
    renderCards(combineResults, elementHTML);
};