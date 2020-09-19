"use strict";
let hacked = false;

let studentArray = [];
let filteredStudents = [];
let expelledStudents = [];

const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    img: "",
    house: "",
    bloodStatus: "",
    expelled: false,
    prefect: false,
    inquisitorial: false

};


document.addEventListener("DOMContentLoaded", compiledData);

async function compiledData() {
    await loadFamilies();
    let jsonData = await loadJSON();
    cleanStudentData(jsonData);
    setButtonEvent();
    displayList(studentArray);
    searching(studentArray);
}

function loadJSON(){
    return fetch("students.json")
    .then( response => response.json() )
    .then( jsonData => {
        // when loaded, prepare objects
        return jsonData;
    })
};

function cleanStudentData(jsonData) {
    jsonData.forEach(student => {
        let nameArray = student.fullname.trim().split(" ");
        
        const newStudent = Object.create(Student);

        newStudent.firstName = capitalizeName(nameArray[0]);
        if(nameArray.length == 2){
            newStudent.lastName = capitalizeName(nameArray[1]);
            newStudent.middleName = null; 
        } else if(nameArray.length == 3) {
            newStudent.lastName = capitalizeName(nameArray[2]); 
            
            if(nameArray[1].includes("\"")){
                newStudent.nickName = capitalizeName(nameArray[1].substring(1,nameArray[1].length-2));
                newStudent.middleName = null; 
            } else{
                newStudent.middleName = capitalizeName(nameArray[1]); 
            }
        } 

        newStudent.house = capitalizeName(student.house.trim());
        newStudent.gender = capitalizeName(student.gender);
        newStudent.img = findFileName(newStudent.firstName, newStudent.lastName);
        newStudent.bloodStatus = bloodStatus(newStudent);

        studentArray.push(newStudent);
    });   
}

function capitalizeName(name){
    if(name.includes("-")){
        let hyphenPos = name.indexOf("-") + 1;
        return name[0].toUpperCase() + name.substring(1,hyphenPos) + name[hyphenPos].toUpperCase() + name.substring(hyphenPos+1,name.length).toLowerCase();
    }
    return name[0].toUpperCase()+name.substring(1,name.length).toLowerCase();  
}

function calcFullName(student) {
    let newFullName;

    if (!student.middleName) {
        newFullName = `${student.firstName} ${student.lastName} "${student.nickName}"`;

        if(!student.nickName){
            newFullName = `${student.firstName} ${student.lastName}`;
        }
    } else if(!student.nickName){
        newFullName = `${student.firstName} ${student.middleName} ${student.lastName}`;
    } else {
        newFullName = `${student.firstName} ${student.middleName} ${student.lastName} "${student.nickName}"`;
    }

    return newFullName;
}

function findFileName(firstName, lastName) {

    if(lastName.includes("-")){
        lastName = lastName.split("-")[1];
    }

    let fileName = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";

    let request = new XMLHttpRequest();
    request.open('HEAD', "images/" + fileName, false);
    request.send();

    if(request.status !== 404){
        return fileName;
    
    }else{
        fileName = lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
        request.open('HEAD', "images/" + fileName, false);
        request.send();
        
        if(request.status !== 404){
            return fileName;
        
        } else{
            return "placeholder.png";
        }
    }
}

function findStudentInArray(firstName, lastName) {
    let index = -1;

    for(let i = 0; i < studentArray.length; i++){

        if(studentArray[i].firstName === firstName && studentArray[i].lastName === lastName){
            index = i;
        } 
    }

    return index;
}

function setButtonEvent() {
    document.querySelectorAll("[data-action=filter]").forEach(elm => {
        elm.addEventListener("click", filtering);
    })

   document.querySelectorAll("[data-action=sort]").forEach(elm => {
        elm.addEventListener("click", sorting);
    })
}

function filtering() {
    let filter = this.dataset.filter;

    document.querySelector("h2").textContent = this.textContent;
    if (filter === "all") {
       filteredStudents = studentArray;
    } else if(filter === "expelled"){
        filteredStudents = expelledStudents;  
    } else {
        filteredStudents = studentArray.filter(elm => {
            return elm.house.toLowerCase() === filter; //filtrerer alle elementer væk, som ikke overholder det boolske udtryk.
        });
    }
    displayList(filteredStudents);
}


function slytherinStudents() {
    return studentArray.filter(elm => {
        return elm.house === 'Slytherin';
    });
}

function ravenclawStudents() {
    return studentArray.filter(elm => {
        return elm.house === 'Ravenclaw';
    });
}

function hufflepuffStudents() {
    return studentArray.filter(elm => {
        return elm.house === 'Hufflepuff';
    });
}

function gryffindorStudents() {
    return studentArray.filter(elm => {
        return elm.house === 'Gryffindor';
    });
}


function sorting() {
    let sortKey = this.dataset.sort;
    let sortDirection = this.dataset.sortDirection;

    if(filteredStudents.length == 0){
        studentArray.sort((a,b)=>{
            if (a[sortKey] < b[sortKey]) {
                return -1;
              }
              if (a[sortKey] > b[sortKey]) {
                return 1;
              } 
              // a must be equal to b
              return 0;
        }) 
        if(sortDirection === "desc") {
            studentArray.reverse();
            this.dataset.sortDirection = "asc";
        } else {
            this.dataset.sortDirection = "desc";
        };
        displayList(studentArray);
    } else {
        filteredStudents.sort((a,b)=>{
            if (a[sortKey] < b[sortKey]) {
                return -1;
              }
              if (a[sortKey] > b[sortKey]) {
                return 1;
              }
              // a must be equal to b
              return 0;
        });

        if(sortDirection === "desc") {
            filteredStudents.reverse();
            this.dataset.sortDirection = "asc";
        } else {
            this.dataset.sortDirection = "desc";
        };
        displayList(filteredStudents);
    }
}


function searching(studentArray) {

    let searchBar = document.querySelector('#searchbar');

    searchBar.addEventListener("input", (e)=> {
        const target = e.target.value;
        const searched = studentArray.filter(elm => {
            return elm.firstName.includes(target) || elm.lastName.includes(target);
        })
        displayList(searched);
    });
}

function expelStudent(e) {
    e.stopPropagation();
    let firstName = this.dataset.firstName;
    let lastName = this.dataset.lastName;

    let index = findStudentInArray(firstName, lastName);

    if(!studentArray[index].hacker){
        studentArray[index].expelled = true;
        expelledStudents.push(studentArray.splice(index, 1)[0]);
        alert(`${firstName} has been EXPELLED. BAD ${studentArray[index].gender.toUpperCase()}`);
        this.parentNode.classList.add("expel_glide");
    } else {
        document.querySelector("#no").play();
        setTimeout(()=>{ alert(`How dare you to try expelling ${firstName}? She is the queen of hackers`)},200);
       
    }
    
    setTimeout(()=>{
        displayList(studentArray);
    }, 500);
  
}

function displayList(students) {
    // clear the list
    document.querySelector("#list .students").innerHTML = "";

    // build a new list
    displayInfo(students);
    students.forEach(displayStudent);
      
}


function displayInfo(students) {
    document.querySelector("[data-field=all] span").textContent = studentArray.length;
    document.querySelector("[data-field=displayed] span").textContent = students.length;
    document.querySelector("[data-field=expelled] span").textContent = expelledStudents.length;
    document.querySelector("[data-field=slytherin] span").textContent = slytherinStudents().length;
    document.querySelector("[data-field=ravenclaw] span").textContent = ravenclawStudents().length;
    document.querySelector("[data-field=hufflepuff] span").textContent = hufflepuffStudents().length;
    document.querySelector("[data-field=gryffindor] span").textContent = gryffindorStudents().length;

}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=fullname]").textContent = calcFullName(student);
    clone.querySelector("[data-field=img]").setAttribute('src', 'images/' + student.img);
    clone.querySelector("[data-field=gender] span").textContent = student.gender;
    clone.querySelector("[data-field=house] span").textContent = student.house;
    clone.querySelector(".expel").setAttribute("data-first-name", student.firstName);
    clone.querySelector(".expel").setAttribute("data-last-name", student.lastName);
    clone.querySelector(".expel").addEventListener("click", expelStudent);
    clone.querySelector(".more").addEventListener("click", () => {
        showModal(student);
    })

    // append clone to list
    document.querySelector(".students").appendChild(clone);
}


function hackTheSystem() {
    hacked = true;

    const myself = Object.create(Student);
    myself.firstName = "Louise";
    myself.nickName = "1337 h4x0r";
    myself.middleName = "Moesgaard";
    myself.lastName = "Nielsen";
    myself.gender = "Girl";
    myself.img = "placeholder.png";
    myself.hacker = true;

    studentArray.push(myself);
    displayList(studentArray);

    let houseValues = ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"];

    myself.house = houseValues[Math.floor(Math.random() * houseValues.length)];

    for (let i = 0; i < studentArray.length; i++){
        studentArray[i].bloodStatus = bloodStatus(studentArray[i]);
    }

}