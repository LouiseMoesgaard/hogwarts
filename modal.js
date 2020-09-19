"use strict";

let families = {};
const modal = document.querySelector("#modal");

function loadFamilies(){
    return fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then( response => response.json() )
    .then( jsonData => {
        families = jsonData;
    })
};


function showModal(student) { 
    modal.querySelector(".modalBody").className = "modalBody";

    modal.querySelector(".modalBody").classList.add(student.house.toLowerCase());

    modal.querySelector(".modalBody div").addEventListener("click", (e) => {
        modal.querySelector(".prefect input").removeEventListener("change", prefectStudent);
        modal.querySelector(".inquisitorial input").removeEventListener("change", inquisitorialStudent);
        modal.classList.add("hide")
    });
    
    modal.querySelector(".studentPhoto").setAttribute("src", "images/" + student.img)
    modal.querySelector(".fullname").innerHTML = calcFullName(student);
    modal.querySelector(".gender span").innerHTML = student.gender;
    modal.querySelector(".house span").innerHTML = student.house;
    modal.querySelector(".bloodStatus span").innerHTML = student.bloodStatus;
    modal.querySelector(".expel input").checked = student.expelled;
    modal.querySelector(".prefect input").setAttribute("data-student", JSON.stringify(student)); // fået hjælp af bekendte.
    modal.querySelector(".prefect input").addEventListener("change", prefectStudent);
    modal.querySelector(".prefect input").checked = student.prefect;
    modal.querySelector(".inquisitorial input").setAttribute("data-student", JSON.stringify(student));
    modal.querySelector(".inquisitorial input").addEventListener("change", inquisitorialStudent);
    modal.querySelector(".inquisitorial input").checked = student.inquisitorial;
    modal.classList.remove("hide");
}

function prefectStudent(){
    let student = JSON.parse(this.dataset.student); // fået hjælp af bekendte. 
    let index = findStudentInArray(student.firstName, student.lastName); 
    if(student.prefect){
        studentArray[index].prefect = false;
        this.dataset.student = JSON.stringify(studentArray[index]);
    } else{
        let prefects = studentArray.filter(elm=>{
            return elm.prefect && elm.house === student.house;
        });
        if(prefects.length < 2){
            studentArray[index].prefect = true;
            this.dataset.student = JSON.stringify(studentArray[index]);
        } else {
            alert("NONO THAT´S IIIILIGAL!");
        }

    }
    modal.querySelector(".prefect input").checked = studentArray[index].prefect;
}

function bloodStatus(student) { 
    let bloodStatus;
    if(families.pure.indexOf(student.lastName) !== -1 && families.half.indexOf(student.lastName) === -1){
        bloodStatus = "Pure-blood";
    } else if(families.pure.indexOf(student.lastName) !== -1 && families.half.indexOf(student.lastName) !== -1){
        bloodStatus = "Half-blood";
    } else{
        bloodStatus = "Muggle-born";
    }
    if(hacked){
        let bloodStatuses = ["Pure-blood", "Half-blood", "Muggle-born"];
        bloodStatus = bloodStatuses[Math.floor(Math.random() * bloodStatus.length)];
    }

    return bloodStatus;
    
}

function inquisitorialStudent() {
    let student = JSON.parse(this.dataset.student);
    let index = findStudentInArray(student.firstName, student.lastName); 
    console.log(student)

        if(student.inquisitorial){
            studentArray[index].inquisitorial = false;
            this.dataset.student = JSON.stringify(studentArray[index]);
        } else {
        
            if(student.bloodStatus == "Pure-blood" || student.house == "Slytherin"){
                studentArray[index].inquisitorial = true;
                this.dataset.student = JSON.stringify(studentArray[index]);
            } else {
                alert("NONO YOU´RE NOT GOOD ENOUGH!");
            }
        }
        modal.querySelector(".inquisitorial input").checked = studentArray[index].inquisitorial;

    if(hacked){
        setTimeout(()=>{
            studentArray[index].inquisitorial = false;
            this.dataset.student = JSON.stringify(studentArray[index]);
            modal.querySelector(".inquisitorial input").checked = studentArray[index].inquisitorial;
            alert("NOOOOOOOO I AM HAAAACKED!");
        },5000);
    }
}
