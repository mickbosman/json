list = ["Theo", "Milena", "Milos", "Rosmerta", "Ed", "Saskia", "Hidde"];

list = list.sort();

let uitvoer = "";
list.forEach((item) => {
    uitvoer += item + '<br>';
});
document.getElementById('uitvoer').innerHTML = uitvoer;
