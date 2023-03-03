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
// Preloader End
preloaderToggleFunction(true);
// Main Content Load
aiDataLoad();

// ModaL Loader
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
    console.log(detail.accuracy);
    // Modal ===============Description=========
    const description = document.getElementById('modal-desc');
    description.innerText = `${detail.description}`;
    // Modal ================Image==============
    const toolImage = document.getElementById('modal-img');
    toolImage.setAttribute('src',`${detail.image_link[0]}`);

    //Modal =============Pricing Plans================
    const pricingPlanarea = document.getElementById('pricingPlan');
    pricingPlanarea.innerHTML = '';
    pricingPlanarea.innerHTML = `
        <div class="col">
            <p class="p-4 bg-white rounded-2 text-success">$<span id="price1">${detail.pricing[0] ? detail.pricing[0].price : 'No Cost'}</span>/Month <span id="plan1">${detail.pricing[0] ? detail.pricing[0].plan : 'Free'}</span></p>
        </div>
        <div class="col">
            <p class="p-4 bg-white rounded-2 text-warning">$<span id="price2">${detail.pricing[1] ? detail.pricing[1].price : 'No Cost'}</span>/Month <span id="plan2">${detail.pricing[1] ? detail.pricing[1].plan : 'Free'}</span></p>
        </div>
        <div class="col">
            <p class="p-4 bg-white rounded-2 text-danger"><span id="price3">${detail.pricing[2] ? detail.pricing[2].price : 'Free'}</span><span id="plan3">${detail.pricing[2] ? detail.pricing[2].plan : 'Free'}</span></p>
        </div>
    `;

    // Modal ===============Features=============
    const modalFeatures = document.getElementById('modal-features');
    modalFeatures.innerHTML = '';
    for(const feature in detail.features){
        const modalFeatureLi = document.createElement('li');
        modalFeatureLi.innerText = `${detail.features[feature].feature_name}`;
        modalFeatures.appendChild(modalFeatureLi);
    }
    // =========================================
    // Modal  ======     Integrations    =======
    // =========================================
    const modalIntegrations = document.getElementById('modal-integrations');
    modalIntegrations.innerHTML = '';
    detail.integrations?.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.innerText = `${item}`;
        modalIntegrations.appendChild(itemLi);
    })

    // Modal ================ Input Output Example ================
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    inputText.innerText = '';
    outputText.innerText = '';
    if (detail.input_output_examples.length > 0) {
        inputText.innerText = `${detail.input_output_examples[0].input}`;
        outputText.innerText = `${detail.input_output_examples[0].output}`;
    } else {
        inputText.innerText = `No input text found`;
        outputText.innerText = `No output text found`;
    }
    // =================================================
    // Modal =========== Accuracy Tag ==================
    // =================================================
    const accuracyTag = document.getElementById('accuracy')
    const accuracyPercentage = (detail.accuracy.score) * 100;
    accuracyTag.innerText = '';
    const accuracyBtn = document.getElementById('accuracy-btn')

    if(detail.accuracy.score){
        accuracyTag.innerText = `${accuracyPercentage}`;
    }else{
        accuracyBtn.classList.add('d-none');
    }


}




