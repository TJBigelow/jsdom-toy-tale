let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
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
    div.innerHTML = `<h2>${toy.name}</h2><img class='toy-avatar' src=${toy.image}><p>Likes: ${toy.likes}</p><button class='like-btn'>❤️</button>`
    const likeBtn = div.querySelector('.like-btn')
    likeBtn.addEventListener('click', function(event){
      let toyLikes = parseInt(toy.likes)
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
      fetch(`http://localhost:3000/toys/${toy.id}`, reqObj).then(resp => resp.json()).then(toy => {
        div.querySelector('p').innerHTML = `Likes: ${toy.likes}`
      })
    })
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
    })
  }
  
  

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys()
  addToyFormListener()
});
