async function getAllresource() {
    // init usefull variable
    let data = [];

    // ask to the back-end all resources
    let response = await fetch("http://localhost:3001/resources", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    // read the back-end response
    if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
    }
    // return all resources sorted
    return data.sort((a, b) => {
        const nameA = a.resourceName
        const nameB = b.resourceName
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
};

function filterResource(resource, resourceSearch){
    // init usefull variable
    let result = [];

    // for each resources
    resource.forEach((element) => {
        // if the resource's name include the searched's name
        if (element.resourceName.toLowerCase().includes(resourceSearch.toLowerCase()))
            // add this resource in the array of sorted resources
            result.push(element);
    });
    // return the array sorted
    return result;
};

function updatePage(page, pageLeft, pageCentral, pageRight, nbPage){
    // update the change page button left
    pageLeft.value = `${--page}`;
    pageLeft.style.opacity = page;

    // update the change page button central
    pageCentral.value = `${++page}`;

    // update the change page button right
    if (page >= nbPage){
        pageRight.value = "";
    } else{
        pageRight.value = `${++page}`;
    }
};

function displayresource(resourcesFilter, page){
    // init usefull variable
    let nbresourceOnPage = 0;

    // for each resources
    for (let i = 1; i < 7; i++){
        // if an resource is defined
        if(resourcesFilter[i + 6 * (page - 1) - 1]){
            // init the slot with the resource
            document.getElementById(`resource${i}`).innerHTML = "<b>" + `${i + 6 * (page - 1)}. ` + "</b>" + resourcesFilter[i + 6 * (page - 1) - 1].resourceName.slice(0, 55) + (resourcesFilter[i + 6 * (page - 1) - 1].resourceName.length > 55 ? "..." : "");
            document.getElementById(`resource${i}`).title = resourcesFilter[i + 6 * (page - 1) - 1].resourceName;

            // increas the number of resource on the page
            nbresourceOnPage++;
        } else {
            // init the slot to void
            document.getElementById(`resource${i}`).innerHTML = "";
        }
    }

    // define the space between page's number and slot
    document.getElementById('pageButton').style.paddingTop = `${13 - nbresourceOnPage}vh`;
};

window.onload=async function searc_resource(){
    // init all usefull variables
    let resources = await getAllresource();
    let page = 1;
    let pageLeft = document.getElementById('pageLeft');
    let pageCentral = document.getElementById('pageCentral');
    let pageRight = document.getElementById('pageRight');
    let resourcesFilter = resources;
    let nbPage = Math.ceil(resourcesFilter.length / 6);
    document.getElementById('resource name').value = "";

    // init the page's display
    displayresource(resourcesFilter, page);
    updatePage(page, pageLeft, pageCentral, pageRight, nbPage);

    // handle the search bar
    document.getElementById('resource name').addEventListener('change', async function(){
        // get all data to update the page with the search
        page = 1;
        let resourceSearch = document.getElementById('resource name').value.trim();
        resourcesFilter =  filterResource(resources, resourceSearch);
        nbPage = Math.ceil(resourcesFilter.length / 6);

        // update the display
        updatePage(page, pageLeft, pageCentral, pageRight, nbPage);
        displayresource(resourcesFilter, page);
    });

    // handle the left change page
    pageLeft.addEventListener('click', function(){
        // if the user isn't on the first page
        if (page > 1){
            // update the page to the left
            updatePage(--page, pageLeft, pageCentral, pageRight, nbPage);
            displayresource(resourcesFilter, page);
        }
    });

    // handle the right change page
    pageRight.addEventListener('click', function(){
        // update the page to the right
        updatePage(++page, pageLeft, pageCentral, pageRight, nbPage);
        displayresource(resourcesFilter, page);
    });

    // handle click on each resources
    for (let i = 1; i < 7; i++){
        document.getElementById(`resource${i}`).addEventListener('click', function () {
            console.log(resourcesFilter[i + 6 * (page - 1) - 1].room);
        })
    }
};