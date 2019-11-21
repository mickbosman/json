let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        sortBookObject.data = JSON.parse(this.responseText);
        sortBookObject.addJSdate();
        sortBookObject.sort();
    }
}
xmlhttp.open('GET', "films.json", true);
xmlhttp.send();


const makeTableHead = (arr) => {
    let head = "<table class='bookSelection'><tr>";
    arr.forEach((item) => {
        head += "<th>" + item + "</th>";
    });
    head += "</tr>";
    return head;
}

const makeTableRow = (arr, accent) => {
    let row = "";
    if(accent == true) {
       row = "<tr class='bookSelection__row--accent'>";
    } else {
       row = "<tr class='bookSelection__row'>";
    }
    arr.forEach((item) => {
        row += "<td class='bookSelection__data-cel'>" + item + "</td>";
    });
    row += "</tr>";
    return row;
}

const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":   number = 0; break;
        case "februari":  number = 1; break;
        case "maart":     number = 2; break;
        case "april":     number = 3; break;
        case "mei":       number = 4; break;
        case "juni":      number = 5; break;
        case "juli":      number = 6; break;
        case "augustus":  number = 7; break;
        case "september": number = 8; break;
        case "oktober":   number = 9; break;
        case "november":  number = 10; break;
        case "december":  number = 11; break;
        default:          number = 0;
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
    for (let i=0; i<array.length; i++) {
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
            default: string += array[i] + " , ";
        }
    }
    return string;
}

let sortBookObject = {
    data: "",

    kenmerk: "titel",

    oplopend: 1,

    addJSdate: function() {
        this.data.forEach((item) => {
            item.jsDatum = changeJSdate(item.kwamUitIn);
        });
    },

    sort: function() {
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend );
        this.uitvoeren(this.data);
    },

    uitvoeren: function(data) {
        let uitvoer = makeTableHead(
            ["titel",
            "regiseur",
            "cover",
            "kwamUitIn",
            "duur (min)",
            "taal",
            "EAN"]);
        for (let i = 0; i < data.length; i++) {
            //afwisslende achtergrond kleur
            let accent = false;
            i%2 == 0 ? accent = true : accent = false;

            let coverImg = "<img src='" + data[i].cover + "' class='bookSelection__cover' alt='" + data[i].titel + "'>";

            let authors = maakOpsomming(data[i].regiseur);
            uitvoer += makeTableRow(
                [data[i].titel,
                authors,
                coverImg,
                data[i].kwamUitIn,
                data[i].duur,
                data[i].taal,
                data[i].ean], accent)
        }
        document.getElementById('uitvoer').innerHTML = uitvoer;
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
