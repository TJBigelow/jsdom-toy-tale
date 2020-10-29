let addToy = false;

document.addEventListener("DOMContentLoaded", main())

function main(){
  fetchToys()
  addToyFormListener()
  addButtonListeners()
}

function fetchToys(){
  fetch('http://localhost:3000/toys').then(resp => resp.json()).then(json => initializeCards(json))
}

function initializeCards(json){
  json.forEach(toy => buildCard(toy))
}

function buildCard(toy){
  const toyCollection = document.getElementById('toy-collection')
  const div = document.createElement('div')
  div.setAttribute('class', 'card')
  div.innerHTML = `<h2>${toy.name}</h2><img class='toy-avatar' src=${toy.image}><p>Likes: ${toy.likes}</p><button data-id='${toy.id}'class='like-btn'>❤️</button>`
  toyCollection.append(div)
}

function addToyFormListener(){
  const form = document.querySelector('.add-toy-form')
  form.addEventListener('submit', function(event){
    event.preventDefault()
    const formData = {
      name: event.target['name'].value,
      image: event.target['image'].value,
      likes: 0
    }

    const reqObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
    fetch('http://localhost:3000/toys', reqObj).then(resp => resp.json()).then(json => buildCard(json))
    form.reset()
  })
}

function addButtonListeners(){
  document.addEventListener('click', function(event){
    if (event.target.className == 'like-btn') {

      const div = event.target.parentElement
      const toyId = event.target.dataset.id
      let toyLikes = parseInt(div.querySelector('p').innerHTML.slice(7))
      toyLikes += 1

      const likeData = {
        likes: toyLikes
      }

      const reqObj = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeData)
      }
      
      fetch(`http://localhost:3000/toys/${toyId}`, reqObj).then(resp => resp.json()).then(toy => {
      div.querySelector('p').innerHTML = `Likes: ${toy.likes}`
      })

    } else if (event.target.id == 'new-toy-btn') {

      const toyFormContainer = document.querySelector(".container");
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
    }
  })
}