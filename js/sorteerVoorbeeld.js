list = ["Theo", "Milena", "Milos", "Rosmerta", "Ed", "Saskia", "Hidde"];

//sort
list = list.sort();

//uitvoeren
let uitvoer = "";
list.forEach((item) => {
    uitvoer += item + '<br>';
});
document.getElementById('uitvoer').innerHTML = uitvoer;