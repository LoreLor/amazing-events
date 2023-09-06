const detailCard = document.getElementById('detailCard')

const datos = data.events
const current = data.currentDate

const queryString = location.search
const param = new URLSearchParams(queryString)

// el parametro identificador
const dataDetail = param.get("id")
const detail = datos.find(item => item._id === dataDetail) 

const createDetailTemplate = (item, current) => {
    let template = ''
    template = `
        <div class="card w-100">
            <div class="row g-0 align-item-center justify-content-evenly align-content-around">
                <div class="col-md-6">
                    <img
                        src=${item.image}
                        class="img-fluid w-100 h-100"
                        alt=${item.name}
                    >
                </div>
                <div class="vr md-2"></div>
                <div class="col-md-4">
                    <div class="card-body dataBody">
                        <h4 class="card-title text-center">
                            ${item.name}
                        </h4>
                        <ul>
                            <li>Date:: ${item.date}</li>
                            <li>Place: ${item.place}</li>
                            <li>Capacity: ${item.capacity}</li>
                            <li>
                                ${item.date < current ? 
                                    `Assistance: ${item.assistance}`
                                : `Estimate: ${item.estimate}`
                                }
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `
        return template
}

const renderDetailTemplate = (item, current, elementHTML) => {
    let structure = ''
    structure += createDetailTemplate(item, current)
    elementHTML.innerHTML = structure
}
console.log(renderDetailTemplate(detail, current, detailCard ))