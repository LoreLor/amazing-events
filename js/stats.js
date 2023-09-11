const datos = () => {
    fetchData()
    .then(res => res)
    .then(data => {
        const dataEvents = data.events
        const currentDate = data.currentDate


        //* Elementos HTML
        const cell1 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(1)");
        const cell2 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(2)");
        const cell3 = document.querySelector("#table-1 tbody tr:nth-child(2) td:nth-child(3)");
        
        const table2 = document.getElementById('table-2')
        const table3 = document.getElementById('table-3')

        //! Past Events
        const filterPast = dataEvents.filter(item => item.date < currentDate)

        //! Upcoming Events
        const filterUpcoming = dataEvents.filter(item => item.date > currentDate)

        //! Mayor Asistencia
        const eventPlusAssistance = plusAssistanceEvent(filterPast)
        const percentAssistPlus = ((eventPlusAssistance.assistance/eventPlusAssistance.capacity)*100).toFixed(2)

        //! Menor Assistance
        const minusAssistance = minusAssistanceEvent(filterPast)
        const percentAssistMinus = ((minusAssistance.assistance/minusAssistance.capacity)*100).toFixed(2)

        //! Mayor Capacidad
        const highestCapacityEvent = plusCapacityEvent(dataEvents)
    
        // Variables de Asignacion a celdas segun posicion en tabla 1
        const highestAssistanceEvent = `${eventPlusAssistance.name} - ${percentAssistPlus}%`;
        const lowestAssistanceEvent = `${minusAssistance.name} - ${percentAssistMinus}%`;
        const highestCapacity = `${highestCapacityEvent.name} - ${highestCapacityEvent.capacity}`;

        cell1.textContent = highestAssistanceEvent;
        cell2.textContent = lowestAssistanceEvent;
        cell3.textContent = highestCapacity;

        //! Statistics Upcoming Events
        const arrTotalUpCategories = comingEventsStatistics(filterUpcoming)
        renderTable2Template(arrTotalUpCategories, table2)

        //! Statistics Past Events
        const arrTotalPerCategories = pastEventsStatistics(filterPast)
        renderTable3Template(arrTotalPerCategories, table3)

    })  
    .catch(err => console.log('err :', err))
}
datos()

//*------------------------------------------
//! Table-1
function plusAssistanceEvent(arr) {
    let plusAssistanceEvent = null;
    let plusNumberAssistance = 0;

    arr.forEach(item => {
        if ((item.assistance/item.capacity) > plusNumberAssistance) {
            plusNumberAssistance = item.assistance/item.capacity;
            plusAssistanceEvent = item;
        }
    });
    return plusAssistanceEvent;
}

function minusAssistanceEvent(arr){
    let minusAssistanceEvent = null;
    let minusNumberAssistance = Infinity;

    arr.forEach(item => {
        if (item.assistance >= 0 && (item.assistance/item.capacity) < minusNumberAssistance) {
            minusNumberAssistance = item.assistance/item.capacity;
            minusAssistanceEvent = item;
        }
    });

    return minusAssistanceEvent;
}

function plusCapacityEvent(arr){
    let capacityEvent = null;
    let capacityNumber = 0;

    arr.forEach(item => {
        if(item.capacity > capacityNumber){
            capacityNumber = item.capacity;
            capacityEvent = item
        }
    })
    return capacityEvent
}

//! Table-2️ 
function comingEventsStatistics(arr) {
    const statistics = arr.reduce((acc, item) => {
        const { category, price, estimate, capacity } = item;

        if (!acc[category]) {
            acc[category] = {
                revenues: 0,
                estimate: 0,
                capacity: 0,
                eventCount: 0,
                percentageEstimate: 0,
            };
        }

        acc[category].revenues += (price * estimate);
        acc[category].estimate += estimate;
        acc[category].capacity += capacity;
        acc[category].eventCount += 1;

        const eventPercentage = (estimate / capacity) * 100;
        acc[category].percentageEstimate += eventPercentage;

        return acc;
    }, []);

    //for in para arr y porque necesito acceder a las keyy dentro de ellas a las propiedades
    for (let category in statistics) {
        const { percentageEstimate, eventCount } = statistics[category];
        //accedo a propiedad y le seteo el porcentaje
        statistics[category].percentageEstimate = percentageEstimate / eventCount;
    }

    return statistics;
}

function createTable2Template(keyItem, item) {
    let template = '';
    template += `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${(item.revenues).toLocaleString()}</td>
            <td>${(item.percentageEstimate).toFixed(2)} %</td>
        </tr>
        `;
    return template;
}

function renderTable2Template(item, elementHTML) {
    let structure = '';
    for (let category in item) {
        structure += createTable2Template(category, item[category]);
    }
        elementHTML.innerHTML = structure;
    return structure;
}


//! Table-3
function pastEventsStatistics(arr){
    let statistics = arr.reduce((acc, item) => {
        const {category, price, assistance, capacity} = item
        
        if(!acc[category]){
            acc[category] = {
                revenues: 0,
                assistance: 0,
                capacity: 0,
                eventCount: 0,
                percentageAssistance:0
            }
        }
        
        acc[category].revenues += (price * assistance)
        acc[category].assistance += assistance
        acc[category].capacity += capacity
        acc[category].eventCount += 1;
        
        const eventPercentage = (assistance / capacity) * 100;
        acc[category].percentageAssistance += eventPercentage;

        return acc
    }, [])
    //for in para arr y porque necesito acceder a las keyy dentro de ellas a las propiedades
    for (let category in statistics) {
        const { percentageAssistance, eventCount } = statistics[category];
        //accedo a propiedad y le seteo el porcentaje
        statistics[category].percentageAssistance = percentageAssistance / eventCount;
    }

    return statistics

    
}

function createTable3Template(keyItem, item) {
    let template = '';
    template += `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${(item.revenues).toLocaleString()}</td>
            <td>${(item.percentageAssistance).toFixed(2)} %</td>
        </tr>
        `;
    return template;
}

function renderTable3Template(item, elementHTML) {
    let structure = '';
    for (let category in item) {
        structure += createTable3Template(category, item[category]);
    }
        elementHTML.innerHTML = structure;
    return structure;
}
