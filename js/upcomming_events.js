let colCard = document.getElementById("colCard");
let template = ``

// Obtiene la fecha actual
let fechaActual = data.currentDate;
let commingEvents = []

// Compara las fechas
const filterComming = (data) =>{
    for (let item of data.events) {
        if (fechaActual < item.date) {
            commingEvents.push(item);
        }
    }
    console.log('commingEvents :>> ', commingEvents);
}

const filterUpComm = filterComming(data)


// renderiza cards
const templateRender = (commingEvents) =>{
    for(let item of commingEvents){
        template += `
        <div class="col">
            <div class="card h-100">
                <img src=${item.image} class="card-img-top" alt="imagen 2">
                <i class="bi bi-heart-fill biFavorite"></i>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">
                        ${item.description}
                    </p>
                </div>
                <div class="hstack gap-3 text-center px-2 py-3">
                    <div class="p-2 fw-bold">$ ${item.price}</div>
                    <div class="p-2 ms-auto">
                        <a href="details.html">Details</a>      
                    </div>
                </div>
            </div>
        </div>`
    }
    return template
}

colCard.innerHTML = templateRender(filterUpComm)

//! cantidad de proximos eventos
const cardsLength = document.getElementById('cardsLength');
let eventsLength = commingEvents.length

cardsLength.innerHTML = eventsLength;


//! Favoritos
//* selecciono todos los corazones
let biClassList = document.querySelectorAll('.biFavorite'); 

    biClassList.forEach((biClass) => {
        let isActive = false; 

        const toggleFavorite = () => {
            //* seteo al estado actual
            isActive = !isActive; 

            if (isActive) {
                //* activo--> true => cambio a rojo
                biClass.style.color = 'red'; 
            } else {
                //* activo--> false => elimino el rojo
                biClass.style.color = ''; 
            }
        }

        //* agrego el evento y la funcion de switcheo al icono
        biClass.addEventListener('click', toggleFavorite);
});

//! checkbox
//* me guardo las categorias en un array
const getCategories = (data) => {
    const arrCategories = [];

    data.events.forEach(item => {
        if (!arrCategories.includes(item.category)) {
            arrCategories.push(item.category);
        }
    });
    return arrCategories;
}

//* accedo al array de categorias
const categories = getCategories(data);

let contentCheck = document.getElementById('contenCheck');
let template2 = '';

const renderChecks = () => {
    for(let item of categories){
            template2 += `
                <div class="form-check form-check-inline">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        name=${item}
                        id=${item}
                        value=${item}
                    >
                    <label class="form-check-label" for="category1"
                        >${item}</label
                    >
                </div>
            `
        }
        template2 += `
                <form class="d-inline-block" role="search" method="post">
                    <div class="input-group">
                        <input
                            class="form-control"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        >
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                    </div>
                </form>
            `
        return template2
}

//* inyecto los checkboxs
contentCheck.innerHTML = renderChecks(categories)


