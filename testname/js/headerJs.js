function getLangFromPath() {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[1] || "default"; // 语言通常是路径的第一部分
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function isNull(value) {
    return value === null;
}

function getLangFromPath() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[1]; // 假设语言代码总是在第一个路径段
}

$(document).ready(function () {

    let langPage = getQueryParam("lang")

    let campaign =getQueryParam("campaign") ;

    let content =getQueryParam("content") ;

    let utm_campaign =getQueryParam("utm_campaign") ;

    let utm_keyword = getQueryParam("keyword") ;

    let utm_medium = getQueryParam("medium") ;

    let utm_source = getQueryParam("source") ;

    let country = getQueryParam("country")

    let source = getQueryParam("utm_source")

    let medium = getQueryParam("utm_medium")


    let indexHref = ""
    let home_str = ""

    if(langPage == "fr"){
        home_str = "Acceuil"
        indexHref = "./fr/list.html?"
    }else if(langPage == "es"){
        home_str = "Inicio"
        indexHref = "./es/list.html?"
    }else if(langPage == "en"){
        home_str = "Home"
        indexHref = "./en/list.html?"
    }else if(langPage == "pt"){
        home_str = "Início"
        indexHref = "./pt/list.html?"
    }else{
        home_str = "FGU"
        indexHref = "./fr/list.html?"
    }

    if(!isNull(medium)){
        indexHref = indexHref + "&utm_medium=" +medium;
    }

    if(!isNull(source)){
        indexHref = indexHref + "&utm_source=" +source;
    }

    if(!isNull(content)){
        indexHref = indexHref + "&content=" +content;
    }

    if(!isNull(campaign)){
        indexHref = indexHref + "&campaign=" +campaign;
    }

    if(!isNull(utm_campaign)){
        indexHref = indexHref + "&utm_campaign=" +utm_campaign;
    }

    if(!isNull(utm_source)){
        indexHref = indexHref + "&source=" +utm_source;
    }

    if(!isNull(utm_keyword)){
        indexHref = indexHref + "&keyword=" +utm_keyword;
    }

    if(!isNull(utm_medium)){
        indexHref = indexHref + "&medium=" +utm_medium;
    }

    if(!isNull(country)){
        indexHref = indexHref + "&country=" +country;
    }

    document.getElementById("menu_index_select").innerText = home_str
    document.getElementById("menu_index_select").href=indexHref
    document.getElementById("picForUrlJump").href=indexHref
    window.addEventListener('load', () => {
        const content = document.getElementById('content_for_page');
        const footer = document.getElementById('content_for_footer');
        const header =  document.getElementById('content_for_header')

        const totalHeight = content.offsetHeight + footer.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (totalHeight < viewportHeight) {
            content.style.minHeight = (viewportHeight - footer.offsetHeight - header.offsetHeight) + 'px';
        }
    });

    window.addEventListener('resize', () => {
        const content = document.getElementById('content_for_page');
        const footer = document.getElementById('content_for_footer');
        const header =  document.getElementById('content_for_header')

        const totalHeight = content.offsetHeight + footer.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (totalHeight < viewportHeight) {
            content.style.minHeight = (viewportHeight - footer.offsetHeight - header.offsetHeight) + 'px';
        }
    });
});