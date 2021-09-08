const alert = document.querySelector(".alert")
const inputContainer = document.getElementById("input-container")
const inputField = document.getElementById("input-field")
const submitButton = document.getElementById("submit-button")
const groceryListContainer = document.querySelector(".grocery-list-container")
const groceryList = document.querySelector(".grocery-list")
const clearButton = document.querySelector(".clear-button")

let editElement
let editFlag = false
let editID = ""


const displayAlert = (text, action) => {
    
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(() => {
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    }, 1000)

}


inputContainer.addEventListener("submit", (e) => {

    e.preventDefault()

    const value = inputField.value
    const id = new Date().getTime().toString()

    if(value && !editFlag) {
        createListItems(id, value)
        displayAlert("Item added to the List", "success")
        groceryListContainer.classList.add("show-container")
        addToLocalStorage(id, value)
        setBackToDefault()
    }

    else if(value && editFlag) {
        editElement.textContent = value
        displayAlert("Item edited successfully", "success")
        editLocalStorage(editID, value)
        setBackToDefault()
    }

    else {
        displayAlert("Please enter a Value", "danger")
    }

})


const deleteItem = (e) => {

    let element = e.currentTarget.parentElement.parentElement
    let id = element.dataset.id

    groceryList.removeChild(element)

    if(groceryList.children.length === 0) {
        groceryListContainer.classList.remove("show-container")
    }

    displayAlert("Item removed successfully", "success")

    setBackToDefault()

    removeFromLocalStorage(id)

}


const editItem = (e) => {
    
    let element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling
    editID = element.dataset.id
    editFlag = true

    inputField.value = editElement.textContent
    submitButton.textContent = "Edit"

}


const clearItems = () => {

    const groceryItems = document.querySelectorAll(".grocery-item")

    if(groceryItems.length > 0) {
        groceryItems.forEach(item => groceryList.removeChild(item))
        groceryListContainer.classList.remove("show-container")
        displayAlert("Items Cleared", "success")
        setBackToDefault()
        localStorage.removeItem("list")
    }

}


const getLocalStorage = () => {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : []
}


const addToLocalStorage = (id, value) => {

    const grocery = {id, value}
    let items = getLocalStorage()

    items.push(grocery)
    localStorage.setItem("list", JSON.stringify(items))
}


const removeFromLocalStorage = (id) => {

    let items = getLocalStorage()

    items = items.filter(item => item.id !== id)
    localStorage.setItem("list", JSON.stringify(items))

}


const editLocalStorage = (id, newValue) => {

    let items = getLocalStorage()

    items = items.map(item => {
        if(item.id === id) {
            item.value = newValue
        }
        return item
    })

    localStorage.setItem("list", JSON.stringify(items))

}


const setBackToDefault = () => {
    inputField.value = ""
    editFlag = false
    editId = ""
    submitButton.textContent = "Submit"
}


const createListItems = (id, value) => {

        let element = document.createElement("li")
        let attribute = document.createAttribute("data-id")
        attribute.value = id
        element.setAttributeNode(attribute)
        element.classList.add("grocery-item")
        element.innerHTML = (`
            <p class="item-name">${value}</p>
            <div class="buttons-container">
                <button class="edit-button">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `)
        groceryList.appendChild(element)

        const deleteButton = element.querySelector(".delete-button")
        deleteButton.addEventListener("click", deleteItem)

        const editButton = element.querySelector(".edit-button")
        editButton.addEventListener("click", editItem)
        
}


const setupItems = () => {

    let items = getLocalStorage()

    if(items.length > 0) {
        items.forEach(item => createListItems(item.id, item.value))
        groceryListContainer.classList.add("show-container")
    }

}


window.addEventListener("DOMContentLoaded", setupItems)

clearButton.addEventListener("click", clearItems)


