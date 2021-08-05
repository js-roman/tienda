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

function updateTable() {
    let goods = JSON.parse(localStorage.getItem("goods"));
    console.log(goods.length);
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
            td6.innerHTML = `<button class="good_delete btn-primary" data-goods="${goods[i][0]}">&#10149;</button>`;

            if (goods[i][4] > 0) {
                goods[i][6] =
                    goods[i][4] * goods[i][2] -
                    goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
                resultPrice += goods[i][6];

                let tr = list.insertRow();
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
                td5.innerHTML = `<input data-goodid="good-${goods.length}" type="text" value="${goods[i][5]}" min="0" max="100">`;
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

function searchGood() {
    let searchString = document.querySelector(".search").value;
    console.log(searchString);
    let options = {
        valueNames: ["name", "price"],
    };
    let listObj = new List("goods", options);
    console.log(listObj);

    // listObj.search(searchString);
}