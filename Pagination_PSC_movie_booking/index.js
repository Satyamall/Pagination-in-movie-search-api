
var activePage = 1;
var totalPages = 1;
var totalItems = 1;
var perPage = 10;
var query = "";

window.onload = function(){

    var sbar = document.querySelector('.search-container')
    sbar.addEventListener('keyup',debouncer(1000, getMoviesBySearch))
    var ul = document.querySelector('.pagination')
    ul.addEventListener('click',function(){
        handlePageChange(getMoviesBySearch)
    })
        
}

function debouncer(delay,callback){
    var debounce;

    return function(){
        query = event.target.value
        debounce && clearTimeout(debounce);
        debounce = setTimeout(function(){
            activePage=1
           callback(query)
        },delay)
    }
}

function getMoviesBySearch(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://www.omdbapi.com/?apikey='+API_KEY+'&s='+query+'&page='+activePage)
    xhr.send()
    xhr.onload = function(){
        var data = JSON.parse(this.response)
        totalItems = Number(data.totalResults);
        totalPages = Math.ceil(totalItems/perPage)

        renderCards(data)
        paginationCreate()
    }
}

function renderCards(results){
     console.log(results)
     var res = document.querySelector('.results')
     res.innerHTML= "";
     var div = document.createDocumentFragment();
     var length = results.Search.length;
     for(var i=0; i<length; i++)
     {
        var cardContainer = createCard(results.Search[i]);
        div.append(cardContainer)
     }
     res.append(div)
}

function createCard(item){
    
    var card = document.createElement('div');
    // card.style.width = "25rem";
    card.setAttribute('class','card p-4 col-lg-3 col-md-6 col-sm-10');

    var img = document.createElement('img');
    img.setAttribute("src",item.Poster)
    img.setAttribute('alt', item.Title);

    var cardBody = document.createElement("div");
    cardBody.setAttribute('class','card-body');

    var title = document.createElement('h5');
    title.textContent = item.Title + ":" + item.Year;
    
    var cardFooter = document.createElement('div');
    cardFooter.setAttribute('class', 'card-body')
    var cardLink = document.createElement('a');
    cardLink.setAttribute("class", 'card-link');
    cardLink.setAttribute('href',"https://www.imdb.com/title/"+item.imdbID+"/");
    cardLink.textContent = "IMDB link";
    
    cardBody.append(title);
    cardFooter.append(cardLink);
    card.append(img,cardBody,cardFooter);
    return card
}

function handlePageChange(callback){
    if(!event.target.name){
        return;
    }
    var value = Number(event.target.name)
    activePage = activePage+value
    if(activePage<1)
    {
        activePage=1
    }
    if(activePage>totalPages){
        activePage = totalPages
    }

    alert(activePage)
   paginationCreate()
   callback(query)
}

function paginationCreate(){
   //total pages

   var ul = document.querySelector('.pagination');
   ul.innerHTML="";
   var fragment = document.createDocumentFragment();

   //prev
   var prev = createPageButton("Previous",activePage===1?true:false, false,-1);
   fragment.append(prev)

   //1,2,3
   for(var i=1; i<=totalPages; i++)
   {
       var page = createPageButton(i,false, activePage===i?true:false,i-activePage)
       fragment.append(page)
   }

   //next
   if(activePage!==totalPages)
   {
       var next = createPageButton('Next',false,false,1);
       fragment.append(next)
   }
   ul.append(fragment)
}

function createPageButton(text,isDisabled,isActive,name){
    
    var cls;
    var pageItem = document.createElement('li')
    cls = isDisabled?
           "page-item disabled" 
           :isActive? 
              "page-item active"
              :"page-item";
    pageItem.setAttribute('class',cls)

    var pageLink = document.createElement('a');
    pageLink.setAttribute('class', 'page-link')
    pageLink.textContent = text;
    pageLink.name = name;

    pageItem.append(pageLink)

    return pageItem
}


// add, delete
// totalPages
// perPage, and totalPages
// re-render the dom
// arr -> length is 100
// perPage ->10
// page -> 2

// page -1 -> 0 -9
// page -2 -> 10 -19

// filter
// filter()

// start_index = (activePage-1)*per_Page
// end_index = activePage*perPage -1

// arr.filter(function(a,i){
    //    return i>=start_index && i<=end_index
//})