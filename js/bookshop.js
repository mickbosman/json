//Import JSON
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        sortBookObject.data = JSON.parse(this.responseText);
        sortBookObject.addJSdate();

        //Capital the first letter of the data and sort on that
        sortBookObject.data.forEach(book => {
            book.titelUpper = book.titel.toUpperCase();
            //also add the (last)name as attribute
            book.sortAuthor = book.auteur[0];
        });
        sortBookObject.sort();
    }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


const createTableHead = (arr) => {
    let head = "<table class='bookSelection'><tr>";
    arr.forEach((item) => {
        head += "<th>" + item + "</th>";
    });
    head += "</tr>";
    return head;
}

const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;
        default:
            number = 0;
    }
    return number;
}

const changeJSdate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length - 1:
                string += array[i];
                break;
            case array.length - 2:
                string += array[i] + " en ";
                break;
            default:
                string += array[i] + " , ";
        }
    }
    return string;
}

//Put the text after , at the front
const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

//to add and remove from the shoppingCart object
let shoppingcart = {
    items: [],

    getItems: function () {
        let purchase;
        if (localStorage.getItem('purchasedBooks') == null) {
            purchase = [];
        } else {
            purchase = JSON.parse(localStorage.getItem('purchasedBooks'));
            purchase.forEach(item => {
                this.items.push(item);
            })
            this.uitvoeren();
        }
        return purchase;
    },

    add: function (el) {
        this.items = this.getItems();
        this.items.push(el);
        localStorage.setItem('purchasedBooks', JSON.stringify(this.items));
        this.uitvoeren();
    },

    uitvoeren: function () {
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
    }
}

shoppingcart.getItems();


//object boeken uitvoeren en sorteren en data
let sortBookObject = {
    data: "",

    kenmerk: "titelUpper",

    oplopend: 1,

    addJSdate: function () {
        this.data.forEach((item) => {
            item.jsDatum = changeJSdate(item.uitgave);
        });
    },

    //data sort
    sort: function () {
        this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        //first empty the id = 'uitvoer'
        document.getElementById('uitvoer').innerHTML = "";

        data.forEach(book => {
            let section = document.createElement('section');
            section.className = 'bookSelection';

            //main element with all the info except the price and cover
            let main = document.createElement('main');
            main.className = 'bookSelection__main';

            //create book cover
            let image = document.createElement('img');
            image.className = 'bookSelection__cover';
            image.setAttribute('src', book.cover);
            image.setAttribute('alt', reverseText(book.titel));

            //create book title
            let title = document.createElement('h3');
            title.className = 'bookSelection__title';
            title.textContent = reverseText(book.titel);

            //add authors
            let authors = document.createElement('p');
            authors.className = 'bookSelection__authors';
            //Reverse the first- and last name of the author
            book.auteur[0] = reverseText(book.auteur[0]);
            //Authors added to a array and changed into NL String
            authors.textContent = maakOpsomming(book.auteur);

            //Add the extra info
            let extra = document.createElement('p');
            extra.className = 'bookSelection__extra';
            extra.textContent = book.uitgave + ' | aantal pagina\'s: ' + book.paginas + ' | ' + book.taal + ' | ean ' + book.ean;

            //add the prices
            let price = document.createElement('div');
            price.className = 'bookSelection__price';
            // https://freeformatter.com/netherlands-standards-code-snippets.html
            price.textContent = book.prijs.toLocaleString('nl-NL', {
                currency: 'EUR',
                style: 'currency'
            });

            //add price button
            let priceButton = document.createElement('button');
            priceButton.className = 'bookSelection__priceButton';
            priceButton.innerHTML = 'add to<br>shoppingcart';
            priceButton.addEventListener('click', () => {
                shoppingcart.add(book);
            })

            //Add the element
            section.appendChild(image);
            main.appendChild(title);
            main.appendChild(authors);
            main.appendChild(extra);
            section.appendChild(main);
            price.appendChild(priceButton);
            section.appendChild(price);
            document.getElementById('uitvoer').appendChild(section);
        });

    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortBookObject.kenmerk = e.target.value;
    sortBookObject.sort();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortBookObject.oplopend = parseInt(e.target.value);
        sortBookObject.sort();
    });
});
