"use strict";

function showModal(student) { 
    const modal = document.querySelector("#modal");
    
    modal.querySelector(".modalBody").className = "modalBody";

    modal.querySelector(".modalBody").classList.add(student.house.toLowerCase());

    modal.querySelector(".modalBody div").addEventListener("click", (e) => modal.classList.add("hide"));
    console.log(student)
    modal.querySelector(".studentPhoto").setAttribute("src", "images/" + student.img)
    modal.querySelector(".fullname").innerHTML = calcFullName(student);
    modal.querySelector(".gender span").innerHTML = student.gender;
    modal.querySelector(".house span").innerHTML = student.house;
    modal.querySelector(".bloodStatus span").innerHTML = "FUCK THIS SHIT";

    //modal.querySelector(".blodStatus").innerHTML = ;
    //modal.querySelector(".prefect")
    //modal.querySelector(".expel")
    //modal.querySelector(".inquisitorial")

    modal.classList.remove("hide");
}

function prefectStudent(){

}