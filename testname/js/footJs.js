function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function isNull(value) {
    return value === null;
}

$(document).ready(function () {
    let langPage = getQueryParam("lang")

    let campaign =getQueryParam("campaign") ;

    let content =getQueryParam("content") ;

    let utm_campaign =getQueryParam("utm_campaign") ;

    let utm_keyword = getQueryParam("keyword") ;

    let utm_medium = getQueryParam("medium") ;

    let utm_source = getQueryParam("source") ;

    let country = getQueryParam("country");

    let aboutus_href = "./about_us.html"
    let privacy_href = "./privacy.html"
    let data_href = "./data.html"

    if(langPage == "fr"){
        aboutus_href = aboutus_href + "?lang=fr"
        privacy_href = privacy_href + "?lang=fr"
        data_href = data_href + "?lang=fr"
    }else if(langPage == "es"){
        aboutus_href = aboutus_href + "?lang=es"
        privacy_href = privacy_href + "?lang=es"
        data_href = data_href + "?lang=es"
    }else if(langPage == "en"){
        aboutus_href = aboutus_href + "?lang=en"
        privacy_href = privacy_href + "?lang=en"
        data_href = data_href + "?lang=en"
    }else if(langPage == "pt"){
        aboutus_href = aboutus_href + "?lang=pt"
        privacy_href = privacy_href + "?lang=pt"
        data_href = data_href + "?lang=pt"
    }else{
        aboutus_href = aboutus_href + "?lang=fr"
        privacy_href = privacy_href + "?lang=fr"
        data_href = data_href + "?lang=fr"
    }

    if(!isNull(utm_campaign)){
        aboutus_href = aboutus_href + "&utm_campaign=" +utm_campaign;
        privacy_href = privacy_href + "&utm_campaign=" +utm_campaign;
        data_href = data_href + "&utm_campaign=" +utm_campaign;
    }

    if(!isNull(campaign)){
        aboutus_href = aboutus_href + "&campaign=" +campaign;
        privacy_href = privacy_href + "&campaign=" +campaign;
        data_href = data_href + "&campaign=" +campaign;
    }

    if(!isNull(content)){
        aboutus_href = aboutus_href + "&content=" +content;
        privacy_href = privacy_href + "&content=" +content;
        data_href = data_href + "&content=" +content;
    }

    if(!isNull(utm_source)){
        aboutus_href = aboutus_href + "&source=" +utm_source;
        privacy_href = privacy_href + "&source=" +utm_source;
        data_href = data_href + "&source=" +utm_source;
    }

    if(!isNull(utm_keyword)){
        aboutus_href = aboutus_href + "&keyword=" +utm_keyword;
        privacy_href = privacy_href + "&keyword=" +utm_keyword;
        data_href = data_href + "&keyword=" +utm_keyword;
    }

    if(!isNull(utm_medium)){
        aboutus_href = aboutus_href + "&medium=" +utm_medium;
        privacy_href = privacy_href + "&medium=" +utm_medium;
        data_href = data_href + "&medium=" +utm_medium;
    }

    if(!isNull(country)){
        aboutus_href = aboutus_href + "&country=" +country;
        privacy_href = privacy_href + "&country=" +country;
        data_href = data_href + "&country=" +country;
    }

    document.getElementById("abount_us_link").href = aboutus_href
    document.getElementById("privacy_link").href=privacy_href
    document.getElementById("data_link").href=data_href

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