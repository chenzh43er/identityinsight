
    /***
    * footer_js
    */
    {
        function getQueryParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        $(document).ready(function () {
        let langPage = getQueryParam("lang")

        let utm_campaign =getQueryParam("utm_campaign") ;

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
    }

    /***
    * header_pic_js
    */
    {
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

        $(document).ready(function () {

        let langPage = getQueryParam("lang")

        let utm_campaign =getQueryParam("utm_campaign") ;

        let indexHref = ""
        let home_str = ""

        if(langPage == "fr"){
        home_str = "Acceuil"
        indexHref = "./list.html?lang=fr"
    }else if(langPage == "es"){
        home_str = "Inicio"
        indexHref = "./list.html?lang=es"
    }else if(langPage == "en"){
        home_str = "Home"
        indexHref = "./list.html?lang=en"
    }else if(langPage == "pt"){
        home_str = "Início"
        indexHref = "./list.html?lang=pt"
    }else{
        home_str = "FGU"
        indexHref = "./list.html?lang=fr"
    }

        if(!isNull(utm_campaign)){
        indexHref = indexHref + "&utm_campaign=" +utm_campaign;
    }

        document.getElementById("menu_index_select").innerText = home_str
        document.getElementById("menu_index_select").href=indexHref
        document.getElementById("picForUrlJump").href=indexHref

    });
    }

    /***
    * index_main
    */
    {
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach((adContainer, index) => {
        (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

        // 定时检查广告容器是否已加载广告
        const checkAdStatus = setInterval(() => {
        if (adContainer.innerHTML.trim()) {
            console.log(`广告容器 ${index + 1} 已加载广告`);
            clearInterval(checkAdStatus);  // 停止检查
        } else {
            console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
            (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
        }
        }, 1000);  // 每1秒检查一次
        });

        $(document).ready(function () {

            document.getElementById("top_adv_public").innerHTML=returnADV_Block();

            let utm_campaign =getQueryParam("utm_campaign") ;

            if(!isNull(utm_campaign)){
            document.getElementById("en_href").href= "./list.html?lang=en" + "&utm_campaign=" +utm_campaign
            document.getElementById("es_href").href= "./list.html?lang=es" + "&utm_campaign=" +utm_campaign
            document.getElementById("fr_href").href= "./list.html?lang=fr" + "&utm_campaign=" +utm_campaign
            document.getElementById("pt_href").href= "./list.html?lang=pt" + "&utm_campaign=" +utm_campaign
            }else{
                document.getElementById("en_href").href= "./list.html?lang=en"
                document.getElementById("es_href").href= "./list.html?lang=es"
                document.getElementById("fr_href").href= "./list.html?lang=fr"
                document.getElementById("pt_href").href= "./list.html?lang=pt"
            }
        });

    }