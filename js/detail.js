const detailCard = document.getElementById('detailCard')

const datos = data.events

const queryString = location.search
const param = new URLSearchParams(queryString)

// el parametro identificador
const dataDetail = param.get("id")
const detail = datos.find(item => item._id === dataDetail) 

const createDetailTemplate = (item) => {
    let template = ''
    template = `
        <div class="card w-100">
            <div class="row g-0">
                <div class="col-md-6">
                    <img
                        src=${item.image}
                        class="img-fluid w-100 h-100"
                        alt=${item.name}
                    >
                </div>
                <div class="vr md-2"></div>
                <div class="col-md-4">
                    <div class="card-body">
                        <h4 class="card-title text-center">
                            ${item.name}
                        </h4>
                        <ul>
                            <li>Date:: ${item.date}</li>
                            <li>Place: ${item.place}</li>
                            <li>Capacity: ${item.capacity}</li>
                            <li>Assistance: ${item.assistance}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `
        return template
}

const renderDetailTemplate = (item, elementHTML) => {
    let structure = ''
    structure += createDetailTemplate(item)
    elementHTML.innerHTML = structure
}
renderDetailTemplate(detail, detailCard )