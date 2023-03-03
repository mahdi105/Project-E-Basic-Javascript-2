const aiDataLoad = async () => {
    try {
        const url = `https://openapi.programming-hero.com/api/ai/tools`;
        const res = await fetch(url);
        const data = await res.json();
        aiDataDisplay(data.data.tools);
    } catch (error) {
        console.log(error);
    }
}
const aiDataDisplay = (tools) => {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    const showAll = document.getElementById('showall');
    if (tools.length > 6) {
        showAll.classList.remove('d-none');
        tools = tools.slice(0, 6);
    } else {
        showAll.classList.add('d-none');
    }
    tools.forEach(tool => {
        const createElement = document.createElement('div');
        createElement.classList.add('col');
        createElement.innerHTML = `
            <div class="card p-3">
                <div class="mb-3">
                    <img src="${tool.image}" class="card-img-top rounded-2" alt="...">
                </div>
                <div>
                    <h3 class="mb-1 fw-semibold">Features</h3>
                    <ol>
                        <li class="${tool.features[0] === undefined?'d-none':'d-block' }">1. ${tool.features[0]}</li>
                        <li class="${tool.features[1] === undefined?'d-none':'d-block' }">2. ${tool.features[1]}</li>
                        <li class="${tool.features[2] === undefined?'d-none':'d-block' }">3. ${tool.features[2]}</li>
                        <li class="${tool.features[3] === undefined?'d-none':'d-block' }">4. ${tool.features[3]}</li>
                        <li class="${tool.features[4] === undefined?'d-none':'d-block' }">5. ${tool.features[4]}</li>
                    </ol>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="fw-semibold">${tool.name}</h3>
                        <p class="text-secondary"><i class="far fa-calendar-alt"></i> <span
                                id="date">${tool.published_in}</span></p>
                    </div>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop" onclick="loadDetails('${tool.id}')">See Details</button>
                    </div>
                </div>
            </div>
        `;
        cardContainer.appendChild(createElement);
    });

    preloaderToggleFunction(false);
}

// Preloader toggle function
const preloaderToggleFunction = (isLoading) => {
    const preloader = document.getElementById('preloader');
    if (isLoading === true) {
        preloader.classList.remove('d-none');
    } else {
        preloader.classList.add('d-none');
    }
}

preloaderToggleFunction(true);
aiDataLoad();

// ModaL 
const loadDetails = async(id) => {
    try{
        const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
        const res = await fetch(url);
        const data = await res.json();
       
        displayModal(data.data);
    }catch(error){
        console.log(error);
    }
}
const displayModal = (detail) => {
    console.log(detail);
    const description = document.getElementById('')
}




