"use strict"
// // SLOPPY MODE
// let user = 'edwin'
// usr = 'edie'
// console.log(usr) //NO ERROR IS THROWN

// // STRICT MODE
// function display() {
//     "use strict"
//     let user = 'joey'
//     usr = 'chandler'
//     console.log(usr)
    
// }

// display()

// class Bank{
//     display(){
//         console.log("Throw errors because every code inside class is in strict mode")
//         delete Object.prototype
//     }
// }
// new Bank().display()

// here it wont throw error
// delete Object.prototype //attempt to delete empty object
// delete [].length //attempt to delete empty array

// let company = 'aspire'
// console.log(delete company) // syntax error
// console.log(delete globalThis.company) //alternate solution to delete

// Attemot to pass duplicate params
// function add(a,a,b)
// {
//     console.log(a,a,b)
//     console.log((a+a+b))
// }
// add(1,2,3)

//duplicating key is allowed in strict mode
const object = {
    fruit: "apple",
    fruit: "banana"
}
console.log(object) //latest value will be assigned to fruit key
