//* Cards
const colCard = document.getElementById("colCard");

//* Checkboxs & Search Content
const contentCheck = document.getElementById("contenCheck");


//* Favoritos
const biClassFav = document.querySelector('.biFavorite'); 

//* Object elements: currentDate - events
const fechaActual = data.currentDate;
const datos = data.events;

//* Events Lengths
const cardsLength = document.getElementById("cardsLength");
let dataLength = datos.length;
cardsLength.innerHTML = dataLength;


//*----------------------------------------

//! Cards Template (elementHTML: colCard)
const createTemplate = (item) => {
    let template = "";
    template += `<div class="col-md-6">
        <div class="card h-100" id="card">
            <img src=${item.image} class="card-img-top" alt=${item.name}>
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
 
    });
    elementHTML.innerHTML = structure;
};
renderCards(datos, colCard);


//*----------------------------------------

//! Checkbox (elementHTML: contentCheck)
// me guardo las categorias en un array - sin elementos duplicados y ordenados
const filterCategories = [...new Set(datos.map((item) => item.category))].sort();

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
    });
    elementHTML.innerHTML = structure;
};
renderChecks(filterCategories, contentCheck);


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
};
renderSearch(contentCheck);

//*----------------------------------------

//! Filters & Listeners

function cheksFiltered() {
    // checks seleccionados
    const nodeListChecks = document.querySelectorAll('input[type="checkbox"]:checked');

    //paso a array
    let arrChecks = Array.from(nodeListChecks).map((input) => input.value);

    //filter
    let itemsFiltered = arrChecks.length > 0
            ? datos.filter((item) => arrChecks.includes(item.category))
            : datos;

    return itemsFiltered;
}

function searchFiltered() {
    // capturo el valor
    const inputValue = document.querySelector('input[type="search"]');
    const valueSearch = inputValue.value.toLowerCase();
    // la primera con mayuscula
    const normalizedValue = valueSearch.charAt(0).toUpperCase() + valueSearch.slice(1) || valueSearch;
    // filter
    let inputSearch = normalizedValue !== ""
            ? datos.filter((item) => (item.name).includes(normalizedValue))
            : datos;
            
    return inputSearch;
}

function combineFilters (){
    // me traigo las funciones de filtrado
    let checksFilterResults = cheksFiltered()
    let searchFilterResult = searchFiltered()

    let combined = checksFilterResults.filter(item => searchFilterResult.includes(item))

    let dataLength = combined.length;
    cardsLength.innerHTML = dataLength;

    return combined
}

const handlerChange = () => {
    let combineResults = combineFilters()
        if(combineResults.length === 0){
            swal("Event is not found, try with other name...");
        }

    renderCards(combineResults, colCard);
};

const handlerSubmit = (e) => {
    e.preventDefault();
    contentCheck.addEventListener('input', handlerChange)
};

// inyecto los escuchadores
contentCheck.addEventListener("change", handlerChange);
contentCheck.addEventListener("submit", handlerSubmit);

//*----------------------------------------

//! Favorites
// cambio el color
function favoriteToggleColor(biClassFav) {
    biClassFav.classList.toggle('biFavRed')
}

// agrego el evento a la card
function addCardFavoriteEvent() {
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('biFavorite')){
            favoriteToggleColor(e.target)
        }
    })
}
addCardFavoriteEvent()

