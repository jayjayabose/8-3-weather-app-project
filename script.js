/**
 * NOTES TO SELF
 * Basic layout
 * Data is retrieved via api (hardcoded)
 * Form events update page
 * Previous list builds and calls function onclick
 * Clear main and previous on first search, but not following searches
 * Connect form to API
 * Display main search result
 * Display below the fold search result. v1
 * implement "previous" link
 * below the fold grid (lots of debugging)
* finish wrestling with results css for result 
* Get the search term + update accordingly (handle repeated search)
* display the main result v .2
*  write below the fold content v.2
* TO DO
 
 * (idea) write today, tomorrow, day after tomorrow into weatherArr

* handle result format (degress, feels like)
* handle empty search

//search result object
{ 
    area: {
        area: __,
        region: __,
        country: __,
        feelsLike: __
    },
    weather: [{avg, max, min}, {avg, max, min}, {avg, max, min}]

}
 */

const URLbase = 'https://wttr.in/';
const URLqueryString = '?format=j1';
const searchResults = new Map(); //holds all search results
let firstSearch = true; 

const form = document.querySelector('form');

//
form.addEventListener("submit", event => {
    event.preventDefault();
    //console.log("event: form submitted");
    //console.log("search term: " + event.target.searchTerm.value);
    let searchTerm = event.target.searchTerm.value;
    let searchTermisNew = (searchResults.get(searchTerm) === undefined); 

    //call API if search term is new
    if (searchTermisNew) {
        fetch(URLbase+searchTerm+URLqueryString)
        .then( (response) => response.json())
        .then( (json) => {
            let areaObj = {
                area: json.nearest_area[0].areaName[0].value,
                region: json.nearest_area[0].region[0].value,
                country: json.nearest_area[0].country[0].value,
                feelsLikeF: 'Feels like ' + json.current_condition[0].FeelsLikeF + ' &#176;'           
                //&#8457
            };
            let weatherArr = [];
            json.weather.forEach(element => {
                weatherArr.push({
                    avgtempF: element.avgtempF,
                    maxtempF: element.maxtempF,
                    mintempF: element.mintempF
                });
            });        
            searchResults.set(searchTerm, { areaObj: areaObj, weatherArr: weatherArr });            
            displayResult(searchTerm, searchTermisNew);                
        })
        .catch( (error) => {
            console.log(error);
        });    
    } else {
        displayResult(searchTerm, searchTermisNew); //could make this asynch
    }        
})


//display search result
const displayResult = (searchTerm, newSearch) => {
    //clear initial user message
    if (firstSearch) document.querySelector("#initialMsg1").remove();

    //generate above the fold content (article)
    generateATFContent(searchTerm);
    
    //generate below the fold content: display today, tomorrow and day after tomorrow (aside)
    generateBTFContent(searchTerm);

    //write to previous list 
    if (newSearch) addToPrevious(searchTerm);
};

//generate above the fold content (article)
const generateATFContent = (searchTerm) => {
      //clear contents,  write search term
      const article = document.querySelector("#aboveTheFold");
      article.textContent = '';    
      let h2 = document.createElement("h2");
      h2.textContent=searchTerm;
      article.append(h2);
      
      //write results
      let areaObj = searchResults.get(searchTerm).areaObj;
      let resultLines = ['Nearest Area: ', 'Region: ', 'Country; ', 'Currently: '];
      
      //for (const property in searchResults.get(searchTerm).areaObj) {
      Object.keys(areaObj).forEach( (property, index) => {
          //console.log('property: ' + property);
          let div = document.createElement("div");
          div.setAttribute("class", "resultLine");
          let span = document.createElement("span");
          span.setAttribute("class", "resultName");
          span.textContent = resultLines[index]; 
          div.textContent = areaObj[property]; //maybe not text content
          div.prepend(span);  
          article.append(div);        
      });
};

const generateBTFContent = (searchTerm) => {
    let articleTitles = ['Today', 'Tomorrow', 'Day After Tomorrow'];
    let resultLines = ['Average Temperature: ', 'Max Temperature: ', 'Min Temperature: ']
    const aside = document.querySelector("#belowTheFold");
    aside.textContent = '';
    let weatherArr = searchResults.get(searchTerm).weatherArr;

    weatherArr.forEach((element, index) => {
        //const aside = document.querySelector("#belowTheFold");
        const article = document.createElement("article")
        let h3 = document.createElement("h3");
        h3.textContent = articleTitles[index];
        article.append(h3);
        //Object.keys(element).forEach(writeResultLines(property,index));

        Object.keys(element).forEach((property, index) => {
            let div = document.createElement("div");
            div.setAttribute("class", "resultLine");
            let span = document.createElement("span");
            span.setAttribute("class", "resultName");
            span.textContent = resultLines[index]; 
            div.textContent = element[property]  //WIP
            div.prepend(span);
            article.append(div);
            //console.log(`${resultLines[index]}: ${element[property]}`);    
        });
       // article.textContent = `Average Temperature: ${element.avgtempF} F <br>`
       
        aside.append(article);
        //console.log()
    });
};

/* should be able to factor out some code, I think
const writeResultLines = (property, index) => {
    let div = document.createElement("div");
    div.setAttribute("class", "resultLine");
    let span = document.createElement("span");
    span.setAttribute("class", "resultName");
    span.textContent = resultLines[index]; 
    div.textContent = element[property]  //WIP
    div.prepend(span);
    article.append(div);    
};
*/

//ADD RESULT TO PREVIOUS LIST
const addToPrevious = (searchTerm) => {
    if (firstSearch) {
        document.querySelector("#initialMsg2").remove()
        firstSearch = false;
    };    
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = searchTerm;
    a.setAttribute("href", '#');
    a.setAttribute("onclick", `displayResult("${searchTerm}",0)`);
    li.append(a);
    ul.append(li);
};

const tempOutput = (input) => {console.log(input)};

