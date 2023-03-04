
// Load data of tools from database
const aiDataLoad = async (dLimit) => {
    try {
        const url = `https://openapi.programming-hero.com/api/ai/tools`;
        const res = await fetch(url);
        const data = await res.json();
        if(dLimit === true){
            const activities = data.data.tools;
            activities.map(obj => {
                var dateString = obj.published_in;
                var dateParts = dateString.split("/");
                // month is 0-based, that's why we need dataParts[1] - 1
                var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
                obj.published_in = dateObject;
            });
            activities.sort((a, b) => b.published_in - a.published_in);
            aiDataDisplay(activities,dLimit);
        }else{
            aiDataDisplay(data.data.tools,dLimit);
        }
       
    } catch (error) {
        console.log(error);
    }
}
const aiDataDisplay = (tools,limit) => {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    const showAll = document.getElementById('showall');
    if (tools.length > limit && limit && typeof limit === 'number') {
        showAll.classList.remove('d-none');
        tools = tools.slice(0, 6);
    } else {
        showAll.classList.add('d-none');
    }
    tools.forEach(tool => {
        if(limit === true){
            tool.published_in = tool.published_in.toLocaleDateString();
        }
        //================= Card Features List Display============
        const featureOl = document.createElement('ol');
        tool.features.forEach(feature =>{
            const featureLi = document.createElement('li');
            featureLi.innerText = `${feature}`;
            featureOl.appendChild(featureLi);
        })
        const featuresList = featureOl.innerHTML;
        // ==================Display Cards=========================
        const createElement = document.createElement('div');
        createElement.classList.add('col');
        createElement.innerHTML = `
            <div class="card p-3" style="min-height:490px;">
                <div class="mb-3">
                    <img src="${tool.image}" class="card-img-top rounded-2" alt="...">
                </div>
                <div>
                    <h3 class="mb-1 fw-semibold">Features</h3>
                    <ol>
                        ${featuresList}
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

// Display Limited Data
const showLimitedData = (dataLimit) => {
    preloaderToggleFunction(true);
    aiDataLoad(dataLimit);
}
showLimitedData(6);

// Display All Data 
const showAllBtn = document.getElementById('showall');
showAllBtn.addEventListener('click',() => {
    showLimitedData();
})

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
            <p class="p-4 bg-white rounded-2 text-success"><span id="price1">${detail.pricing?detail.pricing[0].price : 'No Cost'}</span>/Month <span id="plan1">${detail.pricing?detail.pricing[0].plan : 'Free'}</span></p>
        </div>
        <div class="col">
            <p class="p-4 bg-white rounded-2 text-warning"><span id="price2">${detail.pricing?detail.pricing[1].price : 'No Cost'}</span>/Month <span id="plan2">${detail.pricing?detail.pricing[1].plan : 'Free'}</span></p>
        </div>
        <div class="col">
            <p class="p-4 bg-white rounded-2 text-danger"><span id="price3">${detail.pricing? detail.pricing[2].price : 'Free Of Cost/'}</span><span id="plan3">${detail.pricing?detail.pricing[2].plan : 'Enterprise'}</span></p>
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
    if(detail.integrations !== null){
        if(detail.integrations.length > 0 ){
            detail.integrations.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.innerText = `${item}`;
            modalIntegrations.appendChild(itemLi);
            });
        } 
    }
    else{
        const li = document.createElement('li');
        li.innerText = 'No Integration available';
        modalIntegrations.appendChild(li);
    }

    // =================================================
    // Modal =========== Accuracy Tag ==================
    // =================================================
    const accuracyTag = document.getElementById('accuracy')
    const accuracyPercentage = (detail.accuracy.score) * 100;
    const accuracyBtn = document.getElementById('accuracy-btn');
    if(accuracyPercentage > 0){
        accuracyBtn.classList.remove('d-none');
        accuracyTag.innerText = `${accuracyPercentage}`;
    }else{
        accuracyBtn.classList.add('d-none');
    }

    // Modal ================ Input Output Example ================
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    inputText.innerText = '';
    outputText.innerText = '';
    if(detail.input_output_examples !== null){
        if (detail.input_output_examples.length > 0) {
            inputText.innerText = `${detail.input_output_examples[0].input}`;
            outputText.innerText = `${detail.input_output_examples[0].output}`;
        }
    }
     else {
        inputText.innerText = `Can you give any example?`;
        outputText.innerText = `No! Not Yet! Take a break!!!`;
    }
}

// ===============================================
// ============  SORT BY DATE Filter  ============
// ===============================================
document.getElementById('sortby-btn').addEventListener('click',()=>{
    showLimitedData(true);
})