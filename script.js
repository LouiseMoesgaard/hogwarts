"use strict";

let studentArray = [];
const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    img: "",
    house: ""
};


window.addEventListener("DOMContentLoaded", loadJSON);

function loadJSON(){
    fetch("students.json")
    .then( response => response.json() )
    .then( jsonData => {
        // when loaded, prepare objects
        cleanStudentData(jsonData);
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
        newStudent.img = findFileName(newStudent.firstName, newStudent.lastName);
        studentArray.push(newStudent);
    });   

    console.table(studentArray);
}


function capitalizeName(name){
    if(name.includes("-")){
        let hyphenPos = name.indexOf("-") + 1;
        return name[0].toUpperCase() +name.substring(1,hyphenPos) + name[hyphenPos].toUpperCase() + name.substring(hyphenPos+1,name.length).toLowerCase();
    }
    return name[0].toUpperCase()+name.substring(1,name.length).toLowerCase();  
}


function findFileName(firstName, lastName) {

    if(lastName.includes("-")){
        lastName = lastName.split("-")[1];
    }

    let fileName = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";

    let request = new XMLHttpRequest();
    request.open('HEAD', "/images/" + fileName, false);
    request.send();

    if(request.status !== 404){
        return fileName;
    
    }else{
        fileName = lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
        request.open('HEAD', "/images/" + fileName, false);
        request.send();
        console.log("/images/" + fileName);
        console.log(request.status);
        
        if(request.status !== 404){
            return fileName;
        
        } else{
            return null;
        }
    } 
}