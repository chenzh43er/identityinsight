    /***
    * list_html
    */
    {
        let page=0
        // 渲染首页数据
        function renderHomeData(data,isM,obj_index) {
        return data.map((item,index) => {

        let utm_campaign =getQueryParam("utm_campaign") ;

        let lang =getQueryParam("lang") ;


        let testData = null;

        if(index == 0 && !isNull(utm_campaign)) {
        testData = utm_campaignData[utm_campaign]

        testData.url = testData.url.replace("https://identityinsight.org/es/test-page_es/?","./mqqht.html?lang=es&")
        .replace("https://identityinsight.org/en/test-page_en/?","./mqqht.html?lang=en&")
        .replace("https://identityinsight.org/fr/test-page_fr/?","./mqqht.html?lang=fr&")
        .replace("https://identityinsight.org/pt/test-page_pt/?","./mqqht.html?lang=pt&")

        testData.url = testData.url + "&utm_campaign=" + utm_campaign
    }

        if(index == 0 && !isNull(testData) && isM == 0){

        testData.pic = testData.pic
        .replace("gif","png").replace("https://identityinsight.org/testCommon4","./testname")
        .replace("https://identityinsight.org/testCommon4","./testname")
        .replace("https://identityinsight.org/testCommon5","./testname")
        .replace("https://identityinsight.org/testCommon6","./testname")
        .replace("https://identityinsight.org/testCommon7","./testname")
        .replace("https://identityinsight.org/testCommon8","./testname")
        .replace("https://identityinsight.org/testCommon9","./testname")

        let contentIndex0Html = `
                <a href="${testData.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${testData.pic}"
                                src="${testData.pic}"
                                alt="${testData.title}" loading="lazy">
                        </div>
                        <div class="container-list-item-p" style="height: 80px">
                            <p>${testData.title}</p>
                        </div>
                    </div>
                </a>
                `

        return contentIndex0Html;
    }else{

        item.url = item.url.replace("https://identityinsight.org/es/test-page_es/?","./mqqht.html?lang=es&")
        .replace("https://identityinsight.org/en/test-page_en/?","./mqqht.html?lang=en&")
        .replace("https://identityinsight.org/fr/test-page_fr/?","./mqqht.html?lang=fr&")
        .replace("https://identityinsight.org/pt/test-page_pt/?","./mqqht.html?lang=pt&")

        if(item.url == "#"){
        let langPage = getQueryParam("lang")
        if(langPage == "fr"){
        item.url = "./404notFound.html?lang=fr&utm_content=other"
    }else if(langPage == "es"){
        item.url = "./404notFound.html?lang=es&utm_content=other"
    }else if(langPage == "en"){
        item.url = "./404notFound.html?lang=en&utm_content=other"
    }else if(langPage == "pt"){
        item.url = "./404notFound.html?lang=pt&utm_content=other"
    }else{
        item.url = "./404notFound.html?lang=fr&utm_content=other"
    }
        if (!isNull(utm_campaign)){
        item.url = item.url + "&utm_campaign=" + utm_campaign
    }

    }else if (!isNull(utm_campaign)){
        item.url = item.url + "&utm_campaign=" + utm_campaign
    }

        item.pic = item.pic.replace("gif","png")
        .replace("https://identityinsight.org/testCommon4","./testname")
        .replace("https://identityinsight.org/testCommon5","./testname")
        .replace("https://identityinsight.org/testCommon6","./testname")
        .replace("https://identityinsight.org/testCommon7","./testname")
        .replace("https://identityinsight.org/testCommon8","./testname")
        .replace("https://identityinsight.org/testCommon9","./testname")

        let contentOtherHtml = ``;

        if(obj_index != 1){
        contentOtherHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${item.pic}"
                                src="${item.pic}"
                                alt="${item.title}" loading="lazy">
                        </div>
                        <div class="container-list-item-p" style="height: 80px">
                            <p>${item.title}</p>
                        </div>
                    </div>
                </a>
                `;
    }else{
        contentOtherHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${item.pic}"
                                src="${item.pic}"
                                alt="${item.title}" fetchpriority="high">
                        </div>
                        <div class="container-list-item-p" style="height: 80px">
                            <p>${item.title}</p>
                        </div>
                    </div>
                </a>
                `;
    }


        let advHtml = '<div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);width: 30%">' +
        returnADhtml()+
        '</div>';

        if(index == 1){
        contentOtherHtml = contentOtherHtml + advHtml
    }

        return contentOtherHtml;
    }
    }).join('');
    }

        function isNull(value) {
        return value === null;
    }

        function returnADhtml(){
        let advHtml = returnADV_Block();
        return advHtml;
    }

        function initHomeData() {
        // 渲染首页数据
        page = Number(getQueryParam("page")) ;
        if(page==0){

        document.getElementById('indexadv_1').innerHTML= returnADhtml();
        document.getElementById('indexadv_2').innerHTML= returnADhtml();
        document.getElementById('indexadv_3').innerHTML= returnADhtml();

        document.querySelector('.mostPopular').innerHTML = renderHomeData(dataPage.mostPopular,0,1);
        setTimeout(function(){return},200);
        (adsbygoogle = window.adsbygoogle || []).push({});
        document.querySelector('.theLatest').innerHTML = renderHomeData(dataPage.theLatest,1,0);
        setTimeout(function(){return},200);
        (adsbygoogle = window.adsbygoogle || []).push({});
        document.querySelector('.youMayLike').innerHTML = renderHomeData(dataPage.youMaylike,1,0);
        setTimeout(function(){return},200);
        (adsbygoogle = window.adsbygoogle || []).push({});
    }else{
        document.getElementById('indexadv_3').innerHTML= returnADhtml();
        document.querySelector('.mostPopular').style.display = 'none';
        document.querySelector('.theLatest').style.display = 'none';
        document.querySelector('.tempTitle1').style.display = 'none';
        document.querySelector('.tempTitle2').style.display = 'none';

        document.getElementById('indexadv_1').style.display='none';
        document.getElementById('indexadv_2').style.display='none';

        document.querySelector('.youMayLike').innerHTML = renderHomeData(dataPage.youMaylike,1);
        setTimeout(function(){return},200);
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function initTitleIndex(){
        let langPage = getQueryParam("lang");
        if(langPage == "fr"){
        document.getElementById("title_mp").innerText="Populaires";
        document.getElementById("title_lt").innerText="Récents";
        document.getElementById("title_yml").innerHTML=`<div>Vous aimerez<br/> peut-être</div>`;
        //console.log("fr");
    }else if(langPage == "es"){
        document.getElementById("title_mp").innerText="Más populares";
        document.getElementById("title_lt").innerText="Nuevo";
        document.getElementById("title_yml").innerText="Te podría gustar";
        //console.log("es");
    }else if(langPage == "pt"){
        document.getElementById("title_mp").innerText="Mais Popular";
        document.getElementById("title_lt").innerText="RECENTE";
        document.getElementById("title_yml").innerText="Você pode gostar";
        //console.log("pt");
    }
        else{
        document.getElementById("title_mp").innerText="Most Popular";
        document.getElementById("title_lt").innerText="The Latest";
        document.getElementById("title_yml").innerText=`You May Like`;
        //console.log("en");
    }
    }

        function loadScript(src, callback) {
        let script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = true;

        script.onload = function () {
        //console.log(`${src} 加载完成`);
        if (callback) callback(); // 加载完成后执行回调函数
    };

        script.onerror = function () {
        //console.error(`${src} 加载失败`);
    };

        document.head.appendChild(script); // 插入到 `head` 中
    }

        function deleteCurrentPathCookies() {
        const cookies = document.cookie.split(";");

        cookies.forEach(cookie => {
        const cookieName = cookie.split("=")[0].trim();
        // 删除当前路径下的 cookie
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + window.location.pathname;
    });
    }

        function getReferrerParams() {
        let referrer = document.referrer; // 获取上一级页面的 URL
        if (!referrer) return null; // 如果没有来源页面，则返回 null

        let url = new URL(referrer); // 解析 URL
        let params = new URLSearchParams(url.search); // 获取查询参数

        let paramObj = {};
        for (let [key, value] of params.entries()) {
        paramObj[key] = value;
    }
        return paramObj;
    }

        function initFunctionForPage(){
        initTitleIndex();
        initHomeData();

        $('.nextbtn').on('click', function () {

        if(!Number.isInteger(page)){
        page = 1;
    }else{
        page=parseInt(getQueryParam("page")) + 1;
    }
        //window.location.href = `./index.html?page=` + page;
        window.location.href = "#"
    });
    }


        // 页面加载完成后初始化
        $(document).ready(function () {

        let homedataJs = "https://min1-b8s.pages.dev/public/js/fr/homedata.js";
        let utm_campaign_js_url="./testname/js/fr/utm_campaign.js"
        let langPage = getQueryParam("lang")

        if(langPage == "fr"){
        homedataJs = "./testname/js/fr/homedata.js";
        document.getElementById('nextPageButton').innerText = "Suivant";
        utm_campaign_js_url="./testname/js/fr/utm_campaign.js"
    }else if(langPage == "es"){
        homedataJs = "./testname/js/es/homedata.js";
        document.getElementById('nextPageButton').innerText = "SIGUIENTE";
        utm_campaign_js_url="./testname/js/es/utm_campaign.js"
    }else if(langPage == "pt"){
        homedataJs = "./testname/js/pt/homedata.js";
        document.getElementById('nextPageButton').innerText = "PRÓXIMO";
        utm_campaign_js_url="./testname/js/pt/utm_campaign.js"
    }else if(langPage == "en"){
        homedataJs = "./testname/js/en/homedata.js";
        document.getElementById('nextPageButton').innerText = "next";
        utm_campaign_js_url="./testname/js/en/utm_campaign.js"
    }else{
        // homedataJs = "./testname/js/en/homedata.js";
        // document.getElementById('nextPageButton').innerText = "next";
        // utm_campaign_js_url="./testname/js/en/utm_campaign.js"

        homedataJs = "./testname/js/en/homedata.js";
        document.getElementById('nextPageButton').innerText = "Suivant";
        utm_campaign_js_url="./testname/js/en/utm_campaign.js"
    }

        loadScript(homedataJs, function () {
        loadScript(utm_campaign_js_url, function () {
        deleteCurrentPathCookies();

        let utm_campaign = getQueryParam("utm_campaign");

        const paramLast = getReferrerParams();
        if (!isNull(paramLast) & isNull(utm_campaign)) {
        if (!isNull(paramLast["utm_campaign"]) & paramLast["utm_campaign"] != "undefined") {
        if (paramLast["utm_campaign"] != "undefined" & typeof paramLast["utm_campaign"] != "undefined") {
        let indexHref = ""
        if (langPage == "fr") {
        indexHref = "./list.html?lang=fr"
    } else if (langPage == "es") {
        indexHref = "./list.html?lang=es"
    } else if (langPage == "en") {
        indexHref = "./list.html?lang=en"
    } else if (langPage == "pt") {
        indexHref = "./list.html?lang=pt"
    } else {
        indexHref = "./list.html?lang=en"
    }
        window.location.href = indexHref + "&utm_campaign=" + paramLast["utm_campaign"];
    }
    } else if (paramLast["utm_campaign"] == "undefined" || typeof paramLast["utm_campaign"] == "undefined") {
        let indexHref = ""
        if (langPage == "fr") {
        indexHref = "./list.html?lang=fr"
    } else if (langPage == "es") {
        indexHref = "./list.html?lang=es"
    } else if (langPage == "en") {
        indexHref = "./list.html?lang=en"
    } else if (langPage == "pt") {
        indexHref = "./list.html?lang=pt"
    } else {
        indexHref = "./list.html?lang=en"
    }
        window.location.href = indexHref
    }
    }

        // 初始化数据
        initFunctionForPage();
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach((adContainer, index) => {
        (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

        // 定时检查广告容器是否已加载广告
        const checkAdStatus = setInterval(() => {
        if (adContainer.innerHTML.trim()) {
        //console.log(`广告容器 ${index + 1} 已加载广告`);
        clearInterval(checkAdStatus);  // 停止检查
    } else {
        //console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
        (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
    }
    }, 1000);  // 每1秒检查一次
    });
    });
    });
    });
    }