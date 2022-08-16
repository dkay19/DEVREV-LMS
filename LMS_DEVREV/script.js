const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const titlelist = document.querySelector(".filterBlock .title");
const authorlist = document.querySelector(".filterBlock .author");
const date = document.querySelector(".datee");
const apply = document.querySelector(".apply");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
let globalData = [];
let filterarr = ["", "", ""];

// event listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
date.addEventListener("change", (e) => {
  filterarr[2] = e.target.value;
});
titlelist.addEventListener("click", (e) => {
  filterarr[0] = e.target.innerText;
});
authorlist.addEventListener("click", (e) => {
  filterarr[1] = e.target.innerText;
});
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
apply.addEventListener("click", (e) => {
  //   console.log(filterarr[0].length);
  let hta = "";
  if (filterarr[0].length != 0) {
    let arr = globalData.filter((x) => x.volumeInfo.title === filterarr[0]);
    hta = printlayout(arr);
  } else if (filterarr[1].length != 0) {
    let arr = globalData.filter(
      (x) => x.volumeInfo.authors[0] === filterarr[1]
    );
    printlayout(arr);
  } else if (filterarr[2].length != 0) {
    let arr = globalData.filter(
      (x) => x.volumeInfo.publishedDate === filterarr[2]
    );
    hta = printlayout(arr);
  }
  mealList.innerHTML = hta;
});

// get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchInputTxt}&projection=lite&key=AIzaSyATaDTnpiIHcN8HFnZTvPaCLuPznsOX7jQ`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      //   console.log(data);
      globalData = [];
      if (data.items) {
        data.items.forEach((meal) => {
          //   console.log(meal);

          globalData.push(meal);
          //   html += `
          //             <div class = "meal-item" data-id = "${meal.volumeInfo.title}">
          //                 <div class = "meal-img">
          //                     <img src = "${meal.volumeInfo.imageLinks.smallThumbnail}" alt = "food">
          //                 </div>
          //                 <div class = "meal-name">
          //                     <h3>${meal?.volumeInfo?.title}</h3>
          //                     <a href = "#" class = "recipe-btn">Get Recipe</a>
          //                 </div>
          //             </div>
          //         `;
        });
        html = printlayout(globalData);
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }
      console.log(globalData);
      let title = globalData.map((x) => x.volumeInfo.title);
      let author = globalData.map((x) => x.volumeInfo.authors[0]);
      let ht = "";
      title.forEach((x) => {
        ht += `<button class="titleblock">${x}</button>`;
      });
      console.log(titlelist);
      titlelist.innerHTML = ht;
      ht = "";
      author.forEach((x) => {
        ht += `<button class="titleblock">${x}</button>`;
      });
      authorlist.innerHTML = ht;
      mealList.innerHTML = html;
    });
}
function printlayout(datafro) {
  let htm = "";
  datafro.forEach((meal) => {
    htm += `
    <div class = "meal-item" data-id = "${meal.volumeInfo.title}">
        <div class = "meal-img">
            <img src = "${meal.volumeInfo.imageLinks.smallThumbnail}" alt = "food">
        </div>
        <div class = "meal-name">
            <h3>${meal?.volumeInfo?.title}</h3>
            <a href = "#" class = "recipe-btn">Get Recipe</a>
        </div>
    </div>
`;
  });

  return htm;
}
/*
let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${mealItem.dataset.id}&projection=lite&key=AIzaSyATaDTnpiIHcN8HFnZTvPaCLuPznsOX7jQ`
    )
      .then((response) => response.json())
      .then((data) =>
      */
// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    let str = mealItem.dataset.id;
    let filt = globalData.filter((x) => x.volumeInfo.title === str);
    mealRecipeModal(filt);
  }
}

// create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.volumeInfo.title}</h2>
        <p class = "recipe-category">${meal.volumeInfo.authors}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.volumeInfo.description}</p>
        </div>
        <div class = "recipe-meal-img">s
            <img src = "${meal.volumeInfo.imageLinks.smallThumbnail}" alt = "">
        </div>
        
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
