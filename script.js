let dishes = [
    {
        'image': './img/mushrooms.jpg',
        'headline': 'Vorspeise'
    },
    {
        'name': 'Gefüllte Champignons',
        'description': 'mit Paprika, Tomaten, Hackfleisch oder Speck und alles mit Käse überbacken.',
        'price': 7.90
    },
    {
        'image': './img/couscous_salad.jpg',
        'headline': 'Salate'
    },
    {
        'name': 'Couscous-Salat',
        'description': 'mit Mais, Lauchzwiebeln, Paprika und Gurken.',
        'price': 8.90
    },
    {
        'name': 'leichter Salat',
        'description': 'mit Paprika, Gurken, Lauchzwiebeln und Tomaten - Gewürze und Dressing nach Wahl.',
        'price': 6.50
    },
    {
        'image': './img/pizza_margherita.jpg',
        'headline': 'Pizza'
    },
    {
        'name': 'Pizza Margherita',
        'description': 'wahlweise mit Champignons, Zwiebeln, Ananas und mehr.',
        'price': 10.50
    },
    {
        'name': 'Pizza Salami',
        'description': 'mit Rinder- oder Geflügelsalami.',
        'price': 11.50
    },
    {
        'name': 'Pizza Hawaii',
        'description': 'mit hauchdünnem Putenschinken und Ananas - wahlweise mit Champignons, Zwiebeln und mehr.',
        'price': 12.90
    },
    {
        'image': './img/lasagna.jpg',
        'headline': 'Nudelgerichte'
    },
    {
        'name': 'Nudelauflauf',
        'description': 'mit Cherrytomaten, Mozzarella und Zwiebeln - auf Wunsch mit Chilischoten verfeinert.',
        'price': 10.00
    },
    {
        'name': 'Lasagne',
        'description': 'mit gemischtem Hackfleisch, Zwiebeln, Tomaten und Béchamelsauce - auf Wunsch mit Rotwein verfeinert.',
        'price': 13.50
    },
    {
        'name': 'Käsespätzle',
        'description': 'mit Emmentaler und Zwiebeln - wahlweise mit Speck.',
        'price': 9.50
    }
];


let amounts = [];
let names = [];
let prices = [];


getFromLocalStorage();


function dishesAnchors() {
    document.getElementById('dishesAnchors').innerHTML = `
    <div class="anchorGapTop">
        <a href="#Vorspeise">Vorspeise</a>
        <a href="#Salate">Salate</a>
    </div>
    <div class="anchorGapBottom">
        <a href="#Pizza">Pizza</a>
        <a href="#Nudelgerichte">Nudelgerichte</a>
    </div>
    `;
}


function renderDishes() {
    document.getElementById('content').innerHTML = '';
    for (let i = 0; i < dishes.length; i++) {
        let dish = dishes[i];
        if (dish['image'])
            document.getElementById('content').innerHTML += dishesHeadingsTemplate(dish);

        if (dish['price']) {
            let price = dish['price'].toFixed(2).replace(".", ",");
            document.getElementById('content').innerHTML += dishesTemplate(dish, i, price);
        }
    }
}


function dishesHeadingsTemplate(dish) {
    return `
    <div id="${dish['headline']}">
        <img class="dishesSectionImage" src="${dish['image']}">
        <h2 class="dishesAnchors">${dish['headline']}</h2>
    </div>
`;
}


function dishesTemplate(dish, i, price) {
    return `
        <div onclick="addToBasket(${i})" class="dishContainer">
            <div class="addButtonContainer">
                <h3>${dish['name']}</h3>
                <img class="plus" src="./img/plus.png" alt="Pluszeichen">
           </div>
            ${dish['description']}
            <br>
            <br>
           <h3>${price} €</h3>
        </div>
        `;
}


function renderBasket() {
    if (amounts.length == 0) {
        document.getElementById('payBtn').classList.add('d-none');
        renderEmptyBasket();
        document.getElementById('checkout').innerHTML = '';
    } else {
        document.getElementById('payBtn').classList.remove('d-none');
        document.getElementById('basket').innerHTML = '';
        for (let i = 0; i < names.length; i++) {
            let amount = amounts[i];
            let name = names[i];
            let price = prices[i];
            document.getElementById('basket').innerHTML += basketTemplate(i, amount, name, price);
        }
        updateBasketSum();
    }
}


function basketTemplate(i, amount, name, price) {
    return `
        <div class="basketContents">
            <div class="basketAmountName">
                <b><div>${amount}</div></b>
                <b><div>${name}</div></b>
            </div>
            <div>${price.toFixed(2).replace(".", ",")} €</div>
        </div>
        <div class="removeAddContainer">
            <div onclick="decreaseBasketAmount(${i})" class="minusContainer"><div class="minus"></div></div>
            <div onclick="increaseBasketAmount(${i})"><img class="plus" src="./img/plus.png" alt="Pluszeichen"></div>
        </div>
        <div class="separator"></div>
        `;
}


function renderEmptyBasket() {
    document.getElementById('basket').innerHTML = /*html*/ `
    <div><img class="shoppingCart" src="./img/shopping_cart.png" alt="Einkaufswagen"></div>
    <h2>Fülle deinen Warenkorb</h2>
    <span>Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
    `;
}


function updateBasketSum() { // Calculates basket sum
    let sum = 0;
    let handling = 1.5;
    for (let i = 0; i < prices.length; i++) {
        let subtotal = sum += prices[i] * amounts[i];
        let finalSum = subtotal + handling;

        document.getElementById('checkout').innerHTML = updateBasketTemplate(subtotal, handling, finalSum);
    }
}


function updateBasketTemplate(subtotal, handling, finalSum,) {
    return `
        <div class="checkoutAmounts">
            <div class="checkoutSum"><span>Zwischensumme</span><div>${subtotal.toFixed(2).replace(".", ",")} €</div></div>
            <div class="checkoutSum"><span>Handling</span><div>${handling.toFixed(2).replace(".", ",")} €</div></div>
            <div class="checkoutSum"><b><span>Gesamt</span></b><b><div>${finalSum.toFixed(2).replace(".", ",")} €</div></b></div>
        </div>
        `;
}


function addToBasket(i) {
    let basketName = dishes[i]['name'];
    let basketPrice = dishes[i]['price'];
    let index = names.indexOf(basketName);

    if (index == -1) {
        amounts.push(1);
        names.push(basketName);
        prices.push(basketPrice);
    } else {
        amounts[index]++;
    }
    saveToLocalStorage();
    renderBasket();
}


function increaseBasketAmount(i) {
    amounts[i]++;
    saveToLocalStorage();
    renderBasket();
}


function decreaseBasketAmount(i) {
    if (amounts[i] > 1) {
        amounts[i]--;
    } else {
        amounts.splice(i, 1);
        names.splice(i, 1);
        prices.splice(i, 1);
    }
    saveToLocalStorage();
    renderBasket();
}


function saveToLocalStorage() {
    localStorage.setItem('amounts', JSON.stringify(amounts));
    localStorage.setItem('names', JSON.stringify(names));
    localStorage.setItem('prices', JSON.stringify(prices));
}


function getFromLocalStorage() {
    let savedAmounts = localStorage.getItem('amounts');
    let savedNames = localStorage.getItem('names');
    let savedPrices = localStorage.getItem('prices');

    if (savedAmounts && savedNames && savedPrices) {
        amounts = JSON.parse(savedAmounts);
        names = JSON.parse(savedNames);
        prices = JSON.parse(savedPrices);
    }
}


function openFoldableBasket() {
    document.getElementById('navbar').classList.add("d-none");
    document.getElementById('leftContainer').classList.add("d-none");
    document.getElementById('basketContainer').classList.remove("basketContainer");
    document.getElementById('basketContainer').classList.add("foldableBasket");
    document.getElementById('responsiveBasket').classList.add("d-none");
    document.getElementById('close').classList.remove("d-none");
    document.getElementById('basketHeadingContainer').classList.add("basketHeadingContainer");
}


function closeFoldableBasket() {
    document.getElementById('navbar').classList.remove("d-none");
    document.getElementById('leftContainer').classList.remove("d-none");
    document.getElementById('basketContainer').classList.add("basketContainer");
    document.getElementById('basketContainer').classList.remove("foldableBasket");
    document.getElementById('responsiveBasket').classList.remove("d-none");
    document.getElementById('close').classList.add("d-none");
    document.getElementById('basketHeadingContainer').classList.remove("basketHeadingContainer");
}


function pay() {
    alert("Vielen Dank für deine Bestellung!");
    renderEmptyBasket();
    document.getElementById('checkout').innerHTML = '';
    document.getElementById('payBtn').classList.add('d-none');
    localStorage.clear();
    location.reload();
} 