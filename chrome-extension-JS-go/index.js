let myList = []
let floorPriceList = []
let nameList = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const priceEth = document.getElementById("eth-price")

const inputBtn2 = document.getElementById("input-btn2")


let myListLocal = JSON.parse(localStorage.getItem("myList"))

// vérifie si des données locales existent
if (myListLocal){
    myList = myListLocal
    for (let u = 0; u < myList.length; u++) {
        renderList(u)
    }
} else {
    console.log("liste local vide")
}

inputBtn.addEventListener("click", function() {
    //calcul la longueure de la liste
    let l = myList.length
    myList.push(inputEl.value)
    localStorage.setItem("myList", JSON.stringify(myList))

    

    inputEl.value = ""
    //envoie la longueure de la liste en paramètre
    renderList(l)
})

function renderList(u) {
    const JSONCollection = getJSONCollection(myList[u])
    const JSONethPrice = getEthPrice()
    const allData = Promise.all([JSONCollection, JSONethPrice])

    allData.then(function(jsonData) {
        // console.log(json)
        ethPrice = jsonData[1].ethereum.usd
        priceEth.innerHTML = `Ethereum: ${ethPrice} USD`
        //on appelle la fonction displayResults avec le retour de la fct getJSONCollection qui est le json
        // et on ajoute le floor price à la liste
        floorPriceList.push(getFloorPrice(jsonData));
        nameList.push(jsonData[0].data[0].name);
        let listItems = ""
        for (let i = 0; i < myList.length; i++) {
            listItems += `
                <li>
                    ${nameList[i]} - ${floorPriceList[i]} ETH = ${floorPriceList[i] * ethPrice} USD
                </li>
            `
        }
        ulEl.innerHTML = listItems

    });
}

function getFloorPrice(dataJSON){
    console.log("lets go")
    console.log(dataJSON);
    //console.log(dataJSON.data[0].stats.floor_price)
    return(dataJSON[0].data[0].stats.floor_price)
}

//milady address: 0x5af0d9827e0c53e4799bb226655a1de152a425a5

// renvoie l'objet json
async function getJSONCollection (slug_collection) {

    // If the input is an adress we filter by adress
    if (slug_collection.includes("0x", 0)) {
        user = {
            "filters":{"address":"" + slug_collection + ""},"limit":1,"fields":{"traits":1,"stats":1,"indexingStats.openSea":1,"imageUrl":1,"bannerImageUrl":1,"twitter":1,"externalUrl":1,"instagram":1,"discordUrl":1,"marketplaceCount":1,"floorPrice":1},"offset":0
        }
    // else we filter by slug
    } else {
        user = {
            "filters":{"slug":"" + slug_collection + ""},"limit":1,"fields":{"traits":1,"stats":1,"indexingStats.openSea":1,"slug":1,"imageUrl":1,"bannerImageUrl":1,"twitter":1,"externalUrl":1,"instagram":1,"discordUrl":1,"marketplaceCount":1,"floorPrice":1},"offset":0
        }
    }

    // Options to be given as parameter 
    // in fetch for making requests
    // other then GET
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    }

    // Fake api for making post requests
    const response = await fetch("https://v2.api.genie.xyz/collections", options);

    const jsonData = await response.json();

    console.log(jsonData);
    return jsonData;
}

async function getEthPrice() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const ethPrice = await response.json();

    return ethPrice;
}