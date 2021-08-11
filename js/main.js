if (!localStorage.getItem("goods")) {
    localStorage.setItem("goods", JSON.stringify([]));
}
let counter = 0;
if (!localStorage.getItem("counter")) {
    localStorage.setItem("counter", JSON.stringify(0));
} else counter = JSON.parse(localStorage.getItem("counter"));

let myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
    keyboard: false,
});
document.querySelector("button.add_new").addEventListener("click", saveGoods);
document.querySelector(".list").addEventListener("click", deleteGood);
document.querySelector(".cart").addEventListener("click", deleteGoodFromCart);
document.querySelector(".list").addEventListener("click", moveGood);
document.querySelector(".search").addEventListener("keyup", searchGood);

updateTable();

function saveGoods() {
    let name = document.querySelector("#good_name");
    let price = document.querySelector("#good_price");
    let count = document.querySelector("#good_count");

    if (name.value && price.value && count.value) {
        let goods = JSON.parse(localStorage.getItem("goods"));
        goods.push([
            `good-${counter++}`,
            name.value,
            price.value,
            count.value,
            0,
            0,
            0,
        ]);
        localStorage.setItem("goods", JSON.stringify(goods));
        name.value = "";
        price.value = "";
        count.value = "1";
        console.log("ok");
        myModal.hide;
        updateTable();
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hay que llenar todos campos!",
        });
    }
}

function moveGood(event) {
    if (!event.target.dataset.goods) {
        return;
    }
    let goods = JSON.parse(localStorage.getItem("goods"));
    for (i = 0; i < goods.length; i++) {
        if (goods[i][3] > 0 && goods[i][0] == event.target.dataset.goods) {
            goods[i][4]++;
            goods[i][3]--;
            localStorage.setItem("goods", JSON.stringify(goods));
            updateTable();
        }
    }
}

function updateTable() {
    let goods = JSON.parse(localStorage.getItem("goods"));

    let resultPrice = 0;
    if (goods.length) {
        table1.hidden = false;
        table2.hidden = false;
        let list = document.querySelector(".list");
        let cart = document.querySelector(".cart");
        list.innerHTML = "";
        cart.innerHTML = "";
        for (i = 0; i < goods.length; i++) {
            let tr = list.insertRow();
            tr.classList.add("align-middle");
            let td1 = tr.insertCell();
            let td2 = tr.insertCell();
            let td3 = tr.insertCell();
            let td4 = tr.insertCell();
            let td5 = tr.insertCell();
            let td6 = tr.insertCell();
            td2.classList.add("name");
            td3.classList.add("price");
            // td3.classList.add("name");
            // td4.classList.add("name");
            td1.innerHTML = `${i + 1}`;
            td2.innerHTML = `${goods[i][1]}`;
            td3.innerHTML = `${goods[i][2]}`;
            td4.innerHTML = `${goods[i][3]}`;
            td5.innerHTML = `<button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button>`;
            td6.innerHTML = `<button class="good_move btn-primary" data-goods="${goods[i][0]}">&#10149;</button>`;

            if (goods[i][4] > 0) {
                goods[i][6] =
                    goods[i][4] * goods[i][2] -
                    goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
                resultPrice += goods[i][6];

                let tr = cart.insertRow();
                tr.classList.add("align-middle");
                let td1 = tr.insertCell();
                let td2 = tr.insertCell();
                let td3 = tr.insertCell();
                let td4 = tr.insertCell();
                let td5 = tr.insertCell();
                let td6 = tr.insertCell();
                let td7 = tr.insertCell();

                td2.classList.add("price_name");
                td3.classList.add("price_one");
                td4.classList.add("price_count");
                td5.classList.add("price_discount");
                // td4.classList.add("name");
                td1.innerHTML = `${i + 1}`;
                td2.innerHTML = `${goods[i][1]}`;
                td3.innerHTML = `${goods[i][2]}`;
                td4.innerHTML = `${goods[i][4]}`;
                td5.innerHTML = `<input data-goodid="${goods[i][0]}" type="text" value="${goods[i][5]}" min="0" max="100">`;
                td6.innerHTML = `${goods[i][6]}`;
                td7.innerHTML = `<button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button>`;
            }
        }
    } else {
        table1.hidden = true;
        table2.hidden = true;
    }
    document.querySelector(".price_result").innerHTML = resultPrice + "&euro;";
}

function deleteGood(event) {
    if (!event.target.dataset.delete) {
        return;
    }
    Swal.fire({
        title: "¿Está seguro?",
        text: "¡El producto se elemina!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, eleminalo!",
    }).then((result) => {
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem("goods"));
            for (i = 0; i < goods.length; i++) {
                if (goods[i][0] == event.target.dataset.delete) {
                    goods.splice(i, 1);
                }
            }
            localStorage.setItem("goods", JSON.stringify(goods));
            updateTable();

            Swal.fire("¡Eleminado!", "success");
        }
    });
}

function deleteGoodFromCart(event) {
    if (!event.target.dataset.delete) {
        return;
    }
    let goods = JSON.parse(localStorage.getItem("goods"));
    for (i = 0; i < goods.length; i++) {
        if (goods[i][0] == event.target.dataset.delete) {
            goods[i][3]++;
            goods[i][4]--;
        }
    }
    localStorage.setItem("goods", JSON.stringify(goods));
    updateTable();
}

function searchGood() {
    let searchString = document.querySelector(".search").value;
    console.log(searchString);
    let options = {
        valueNames: ["name", "price"],
    };
    let listObj = new List("goods", options);
    console.log(listObj);

    listObj.search(searchString);
}

table1.onclick = (event) => {
    if (event.target.tagName != "TH") return;
    sortGoods(event, "table1");
};
table2.onclick = (event) => {
    if (event.target.tagName != "TH") return;
    sortGoods(event, "table2");
};

function sortGoods(event, id) {
    let th = event.target;
    let type = th.dataset.type;
    let colNum = th.cellIndex;

    const rowsArray = Array.from(
        document.getElementById(id).querySelector("tbody").rows
    );
    let compare;
    switch (type) {
        case "number":
            compare = function(row1, row2) {
                return row1.cells[colNum].innerHTML - row2.cells[colNum].innerHTML;
            };
            break;
        case "string":
            compare = function(row1, row2) {
                return row1.cells[colNum].innerHTML > row2.cells[colNum].innerHTML;
            };
            break;
    }
    rowsArray.sort(compare);
    document
        .getElementById(id)
        .querySelector("tbody")
        .append(...rowsArray);
}

table2.addEventListener("input", (event) => {
    calcDesc(event);
});

function calcDesc(event) {
    let goods = JSON.parse(localStorage.getItem("goods"));
    let desc = event.target.value;
    let id;
    for (i = 0; i < goods.length; i++) {
        if (goods[i][0] == event.target.dataset.goodid) {
            goods[i][5] = desc;
            id = goods[i][0];
            console.log(goods[i][0] + "111" + goods[i][5]);
            goods[i][6] = goods[i][2] * goods[i][3] * (100 - goods[i][5]);
            localStorage.setItem("goods", JSON.stringify(goods));
        }
    }
    updateTable();
    // event.target.focus();
    // event.target.style.backgroundColor = "green";
    // event.target.value = "10";
    document.querySelector(`[data-goodid=${id}]`).focus();
    document.querySelector(`[data-goodid=${id}]`).selectionStart = desc.length;
    console.log(event.target);
    console.log(document.querySelector(`[data-goodid=${id}]`));

    console.log(event.target == document.querySelector(`[data-goodid=${id}]`));
}