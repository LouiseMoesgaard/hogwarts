"use strict";

function showModal(student) { 
    const modal = document.querySelector("#modal");

    modal.querySelector("div").addEventListener("click", () => modal.classList.add("hide"));

    modal.querySelector(".fullname").innerHTML = calcFullName(student);
    //modal.querySelector(".crest").setAttribute("src=", );
    //modal.querySelector(".blodStatus").innerHTML = ;
    //modal.querySelector(".prefect")
    //modal.querySelector(".expel")
    //modal.querySelector(".inquisitorial")

    modal.classList.remove("hide");
}

function prefectStudent(){

}