function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function isNull(value) {
    return value === null;
}

$(document).ready(function () {

    let langPage = getLangFromPath();

    let campaign =getQueryParam("campaign") ;

    //let content =getQueryParam("content") ;

    let utm_campaign =getQueryParam("utm_campaign") ;

    let utm_keyword = getQueryParam("keyword") ;

    let utm_medium = getQueryParam("medium") ;

    let utm_source = getQueryParam("source") ;

    let country = getQueryParam("country")

    let source = getQueryParam("utm_source")

    let medium = getQueryParam("utm_medium")


    let indexHref = ""
    let home_str = ""
    let movie_str = ""
    let quiz_str = "Quiz"

    let toListCat12 = "/en/list/horoscope"
    let toListCat13 = "../list/throwback.html?"
    let toListCat14 = "../list/movie.html?"
    let toListCat15 = "../list/quiz.html?"

    if(langPage == "fr"){
        home_str = "Acceuil"
        indexHref = "../list.html?"
        toListCat12 = "/fr/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "es"){
        home_str = "Inicio"
        indexHref = "../list.html?"
        toListCat12 = "/es/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "en"){
        home_str = "Home"
        indexHref = "../list.html?"
        toListCat12 = "/en/list/horoscope"
        movie_str = "Movie"
        quiz_str = "Quiz"
    }else if(langPage == "pt"){
        home_str = "Início"
        indexHref = "../list.html?"
        toListCat12 = "/pt/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "de"){
        home_str = "Startseite";   // 最常见、简洁
        indexHref = "../list.html?"; // 链接保持不变
        toListCat12 = "/de/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "ar"){
        home_str = "الرئيسية";
        indexHref = "../list.html?";
        toListCat12 = "/ar/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "no"){
        home_str = "Hjem"
        indexHref = "../list.html?"
        toListCat12 = "/no/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "jp") {
        home_str = "ホーム"
        indexHref = "../list.html?"
        toListCat12 = "/jp/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "sv") {
        home_str = "Startsida"
        indexHref = "../list.html?"
        toListCat12 = "/nl/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }else if(langPage == "nl") {
        home_str = "Startsida"
        indexHref = "../list.html?"
        toListCat12 = "/nl/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }
    else{
        home_str = "الرئيسية";
        indexHref = "../list.html?";
        toListCat12 = "/en/list/horoscope"
        movie_str = "Film"
        quiz_str = "Quiz"
    }
    let toListCat1 = "../list/harrypotter.html?"

    if(!isNull(medium)){
        indexHref = indexHref + "&utm_medium=" +medium;
        toListCat1 = toListCat1  + "&utm_medium=" +medium;
    }

    if(!isNull(source)){
        indexHref = indexHref + "&utm_source=" +source;
        toListCat1 = toListCat1 + "&utm_source=" +source;
    }

    // if(!isNull(content)){
    //     indexHref = indexHref + "&content=" +content;
    // }

    if(!isNull(campaign)){
        indexHref = indexHref + "&campaign=" +campaign;
        toListCat1 = toListCat1 + "&campaign=" +campaign;
    }

    if(!isNull(utm_campaign)){
        indexHref = indexHref + "&utm_campaign=" +utm_campaign;
        toListCat1 = toListCat1 + "&utm_campaign=" +utm_campaign;
    }

    if(!isNull(utm_source)){
        indexHref = indexHref + "&source=" +utm_source;
        toListCat1 = toListCat1+ "&source=" +utm_source;
    }

    if(!isNull(utm_keyword)){
        indexHref = indexHref + "&keyword=" +utm_keyword;
        toListCat1 = toListCat1 + "&keyword=" +utm_keyword;
    }

    if(!isNull(utm_medium)){
        indexHref = indexHref + "&medium=" +utm_medium;
        toListCat1 = toListCat1 + "&medium=" +utm_medium;
    }

    if(!isNull(country)){
        indexHref = indexHref + "&country=" +country;
        toListCat1 = toListCat1 + "&country=" +country;
    }

    document.getElementById("menu_index_select1").innerText = home_str
    var mobileHomeEl = document.getElementById("mobile_home");
    if (mobileHomeEl) {
        mobileHomeEl.innerText = home_str;
    } else {
        console.warn('元素 #mobile_home 不存在');
    }
    document.getElementById("menu_index_select1").href=indexHref

    document.getElementById("menu_index_select2").innerText = "Harry Potter"
    document.getElementById("menu_index_select2").href=toListCat1

    let lang = getLangFromPath(); // en / de / nl

    let menuText = "Horoscope";
    let throwbackStr = "Throwback"

    if (lang === "de") {
        menuText = "Horoskop";
    } else if (lang === "sv") {
        menuText = "Horoskop";
    }else{
        menuText = "Horoscope";
    }

    // toListCat12 = toListCat12 + "?campaign=horo"

    document.getElementById("menu_index_select3").innerText = menuText;
    document.getElementById("menu_index_select3").href=toListCat12

    document.getElementById("menu_index_select4").innerText = throwbackStr;
    document.getElementById("menu_index_select4").href=toListCat13

    document.getElementById("menu_index_select5").innerText = movie_str;
    document.getElementById("menu_index_select5").href=toListCat14

    document.getElementById("menu_index_select6").innerText = quiz_str;
    document.getElementById("menu_index_select6").href=toListCat15

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