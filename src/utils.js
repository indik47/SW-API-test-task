function sortEntitiesByName(entitiesArray) {
    entitiesArray.sort(function(a, b){
        let valueA = a.name || a.title;
        let valueB = b.name || b.title;

        if(valueA < valueB) return -1;
        if(valueA > valueB) return 1;
        return 0;
    });
    console.log("sorting done");
}

const handleErrors = function (responce) {
    if (!responce.ok) {
        throw Error(responce.status);
    }
    return responce;
};

const getNumberOfPages = function (entitiesType) {
    return fetch(`https://swapi.co/api/${entitiesType}/`)
        .then(responce => responce.json())
        .then(json => {
            return Math.ceil( json.count / 10 );
        })
};

const sendPromises = function (entitiesType, pages) {
    let promises = [];

    for (let i = 1; i <= pages; i++) {
        const promise = fetch(`https://swapi.co/api/${entitiesType}/?page=${i}`)
            .then(handleErrors)
            .then(responce => responce.json())
            .catch(error => console.log(`error in fetch loop = ${error}`));

        promises.push(promise);
    }

    return promises;
};

const resolvePromises = function (promises) {
    let entities = [];
    return Promise.all(promises)
        .then(responces => {
            responces.forEach(responce => {
                entities = [...entities, ...responce.results];
            });
            return entities;
        })
        .catch(error => {
            console.log(`error in Promise.All = ${error}`);
            return 'error in Promise.all'
        })
};

const fetchEntities = function(entitiesType){
    return getNumberOfPages(entitiesType)
        .then(pages => {
            return resolvePromises( sendPromises(entitiesType, pages) );
        });
};

const fetchUrls = function (urls) {
    const promises = [];
     urls.forEach(url => {
        promises.push( fetch(url)
            .then (data => data.json())
        )
    });

    return Promise.all(promises)
        .then(data => {
            return data;
        })
};


const beautifyKeyStr = function (inputStr) {
    const upperCaseStr = inputStr.charAt(0).toUpperCase() + inputStr.substr(1);
    return upperCaseStr.split('_').join(' ');
};

const beautifyTimeStr = function (inputStr) {
    const timeData = inputStr.split('T');

    timeData[1] = timeData[1].slice(0,8);
    return timeData.join(' ');
};


export default fetchEntities
export {fetchUrls, sortEntitiesByName, beautifyKeyStr, beautifyTimeStr}
