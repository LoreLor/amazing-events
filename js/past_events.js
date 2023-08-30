let colCard = document.getElementById("colCard");
let template = ``;

// Obtiene la fecha actual
let fechaActual = data.currentDate;
let pastEvents = [];


// Compara las fechas
const filterPastDate = () =>{
    for (let item of data.events) {
        if (fechaActual > item.date) {
            pastEvents.push(item);
        }
    }
}
const filterPast = filterPastDate()

//renderiza cards
const templateRender = () => {
    for(let item of pastEvents){
        template += `<div class="col">
        <div class="card h-100">
            <img src=${item.image} class="card-img-top" alt="imagen 2">
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
        </div>`;
    
    }
    return template
}



colCard.innerHTML = templateRender(filterPast)