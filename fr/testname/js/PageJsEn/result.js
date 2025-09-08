
    /***
    * footer
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


    });
    }

    /***
    * bt_adv
    */
    {
        $(document).ready(function () {
            document.getElementById("top_adv_public").innerHTML = return_adv();
            document.getElementById("bot_adv_public").innerHTML = return_adv();
        });

        function return_adv(){
        let advMqqnlHtml = returnADV_Block()

        return advMqqnlHtml;
    }
    }

    /***
    * res_html
    */
    {
        // 定义结果数据

        function getQueryParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        function encryptBase64(text) {
        return btoa(text);
    }

        function decryptBase64(encodedText) {
        return atob(encodedText);
    }


        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        // 获取URL参数并显示对应结果
        function getResultFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);

        const key1 = localStorage.getItem('result');
        const key2 =  parseInt(localStorage.getItem('titleid'));

        const resultIdIn = urlParams.get('result')

        //let resultId = encryptBase64(resultIdIn)
        let resultId = decryptBase64(key1);

        const titelId = urlParams.get('titleid');
        const lang = getQueryParam("lang");

        let result_url = "https://identityinsight.org/testCommon4/js/fr_result/"

        if(lang == "fr"){
        result_url = "./testname/js/fr_result/";
    }else if(lang == "es"){
        result_url = "./testname/js/es_result/";
    }else if(lang == "pt"){
        result_url = "./testname/js/pt_result/";
    }else if(lang == "en"){
        result_url = "./testname/js/en_result/";
    }else{
        result_url = "./testname/js/en_result/"
    }

        loadScript(result_url + key2 + ".js", function () {
        //loadScript("./testname/js/fr_result/" + titelId + ".js", function () {
        // 初始化数据
        const result = results[resultId] || results[1];

        document.getElementById('test-title').textContent = result.title;
        document.getElementById('resultTitle').textContent = result.resultTitle;
        document.getElementById('resultDescription').textContent = result.description;
        document.getElementById('resultMainPic').src=result.mainPic.replace("https://identityinsight.org/testCommon4","./testname");
    });

        // loadScript("https://identityinsight.org/testCommon4/js/fr_result/" + titelId + ".js", function () {
        // //loadScript("./testname/js/fr_result/" + titelId + ".js", function () {
        //   // 初始化数据
        //   const result = results[resultId] || results[1];
        //
        //   document.getElementById('test-title').textContent = result.title;
        //   document.getElementById('resultTitle').textContent = result.resultTitle;
        //   document.getElementById('resultDescription').textContent = result.description;
        //   document.getElementById('resultMainPic').src=result.mainPic;
        // });
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

        // 页面加载时执行
        //     window.onload = function () {
        // console.log(1);

        //       getResultFromUrl();
        //     };

        $(document).ready(function () {

        deleteCurrentPathCookies();

        document.querySelector('.result-container').innerHTML = `<img src="./testname/img/loading.gif">`
        //console.log(3);

        setTimeout(() => {
        document.querySelector('.result-container').innerHTML =

        `<h1 class="test-title" id="test-title"></h1>

                <img src="" alt="Avatar World Home" class="result-image" id="resultMainPic">

                <h2 class="result-title" id="resultTitle"></h2>

                <p class="result-description" id="resultDescription"></p>`
        getResultFromUrl();
        //console.log(2);
    }, 1000)

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

        function deleteCurrentPathCookies() {
        const cookies = document.cookie.split(";");

        cookies.forEach(cookie => {
        const cookieName = cookie.split("=")[0].trim();
        // 删除当前路径下的 cookie
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + window.location.pathname;
    });
    }



    }

    /***
    * mt_html
    */
    {
        function isNull(value) {
            return value === null;
        }

        // 渲染首页数据
        function renderHomeData(data) {
        return data.map((item,index) => {

        let utm_campaign =getQueryParam("utm_campaign") ;

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

        item.url = item.url.replace("titleid","utm_content")
        item.pic = item.pic
        .replace("https://identityinsight.org/testCommon4","./testname").replace("gif","png")

        let moHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${item.pic}"
                                src="${item.pic}"
                                alt="${item.title}" loading="lazy">
                        </div>
                        <div class="container-list-item-p"  style="height: 80px">
                            <p>${item.title}</p>
                        </div>
                    </div>
                </a>
                `

        if(index == 0){
        moHtml = '<div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">' +
        returnMTADV() +
        '</div>' + moHtml
    }

        return moHtml;
    }).join('');
    }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function initTitleMT(){
        let langPage = getQueryParam("lang")
        if(langPage=="fr"){
        document.getElementById("titleForRecMT").innerText="Les plus testés";
        //console.log("fr");
    }else if(langPage == "es"){
        document.getElementById("titleForRecMT").innerText="Más completado";
        //console.log("es");
    }else if(langPage == "pt"){
        document.getElementById("titleForRecMT").innerText="mais testado";
        //console.log("pt");
    }else{
        document.getElementById("titleForRecMT").innerText="Most Tested";
        //console.log("en");
    }
    }

        function updatePageHeight() {
        const viewportHeight = window.innerHeight; // 可视区域高度
        const pageHeight = document.documentElement.scrollHeight; // 整个页面高度

        output.innerHTML = `可视区域高度: ${viewportHeight}px<br>页面总高度: ${pageHeight}px`;
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

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function updatePageHeight() {
        if(window.innerWidth > 500){
        const div = document.getElementById('this_mt_right');
        const divheight = div.offsetHeight;
        let totalHeight = 0;
        const qtq = document.querySelector('.quiz_test-question')
        const rq = document.querySelector('.recommend-quizzes')
        try{
        totalHeight = qtq.offsetHeight + rq.offsetHeight
    }catch (ex){
        totalHeight = 0
    }

        const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        document.getElementById('adv_sticky').style.height = (totalHeight - divheight) + 'px';
        //console.log('sticky高度:', document.getElementById('adv_sticky').offsetHeight);
    }

    }

        function initHomeDataForMo() {
        // 渲染首页数据
        document.querySelector('.tested').innerHTML = renderHomeData(dataM.tested);
    }
        // 页面加载完成后初始化
        $(document).ready(function () {

        if(window.innerWidth < 500){
        document.getElementById('adv_sticky').innerHTML = ''
        document.getElementById('adv_sticky').style.height = '0px'
    }else{
        document.getElementById('RightBottom_adbox').innerHTML = returnZhongxiangGuding();
    }


        initTitleMT();

        // 监听窗口的resize事件，页面尺寸变化时触发
        //window.addEventListener('resize', updatePageHeight);

        // 监听滚动条的scroll事件，滚动时触发
        window.addEventListener('scroll', updatePageHeight);

        // 初始获取页面高度
        updatePageHeight();

        let mt_data_url = ""

        let langPage = getQueryParam("lang")
        if(langPage == "fr"){
        mt_data_url = "./testname/js/fr_most_test_data/Most Tested.js";
    }else if(langPage == "pt"){
        mt_data_url = "./testname/js/pt_most_test_data/Most Tested.js";
    }else if(langPage == "es"){
        mt_data_url = "./testname/js/es_most_test_data/Most Tested.js";
    }else if(langPage == "en"){
        mt_data_url = "./testname/js/en_most_test_data/Most Tested.js";
    }else{
        mt_data_url = "./testname/js/en_most_test_data/Most Tested.js"
    }



        loadScript(mt_data_url, function () {
        // 初始化数据
        initHomeDataForMo();
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
    }, 10000);  // 每1秒检查一次
    });
    });
    });

        function returnMTADV(){
        let advHtml = returnADV_Block();
        return advHtml;
    }
    }

    /***
    * rc_html
    */
    {
        // 渲染首页数据
        function renderHomeDataForRQ(data) {
            return data.map((item,index) => {

                let utm_campaign =getQueryParam("utm_campaign") ;

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


                item.url = item.url.replace("titleid","utm_content")
                item.pic = item.pic
                    .replace("https://identityinsight.org/testCommon4","./testname").replace("gif","png")

                let recHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">
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
                `

                if(index == 0){
                    recHtml = ' <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">' +
                        returnRQADV()+
                        '</div>' + recHtml
                }

                return recHtml;
            }).join('');
        }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
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
    }

        document.head.appendChild(script); // 插入到 `head` 中
    }

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function initTitle(){
        let langPage = getQueryParam("lang")
        if(langPage=="fr"){
        document.getElementById("titleForRec").innerText="Quizs Recommandés"
    }else if(langPage == "es"){
        document.getElementById("titleForRec").innerText="RECOMIENDA TOMAR"
    }else if(langPage == "pt"){
        document.getElementById("titleForRecMT").innerText="RECOMENDAR QUIZZES";
    }else{
        document.getElementById("titleForRec").innerText="RECOMMEND QUIZZES "
    }
    }

        function initHomeDataForRQ() {
        // 渲染首页数据
        initTitle();
        document.querySelector('.recommend').innerHTML = renderHomeDataForRQ(dataR.recommend);
    }
        // 页面加载完成后初始化

        $(document).ready( function () {
        // 初始化数据
        let langPage = getQueryParam("lang")

        let rq_data_url = "./testname/js/fr_recommend/recommend quizzes.js"
        if(langPage == "fr"){
        rq_data_url = "./testname/js/fr_recommend/recommend quizzes.js"
    }else if(langPage == "pt"){
        rq_data_url = "./testname/js/pt_recommend/recommend quizzes.js"
    }else if(langPage == "en"){
        rq_data_url = "./testname/js/en_recommend/recommend quizzes.js"
    }else if(langPage == "es"){
        rq_data_url = "./testname/js/es_recommend/recommend quizzes.js"
    }else{
        rq_data_url = "./testname/js/en_recommend/recommend quizzes.js"
    }


        loadScript(rq_data_url, function () {
        // 初始化数据
        initHomeDataForRQ();
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
    }, 10000);  // 每1秒检查一次
    });
    });
    });

        function returnRQADV(){
        let advHtml = returnADV_Block();
        return advHtml;
    }

        function isNull(value) {
        return value === null;
    }
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