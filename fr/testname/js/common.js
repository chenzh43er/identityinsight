function getLangFromPath() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[1]; // 假设语言代码总是在第一个路径段
}

// window.onscroll = null;

// 选择需要观察的节点（通常是整个 body）
const targetNode = document.body;

// 创建观察者实例
const observer = new MutationObserver(() => {
    const consentDiv = document.querySelector('.fc-consent-root');
    if (consentDiv) {
        console.log('⚡ fc-consent-root 已打开');
    } else {
        console.log('❌ fc-consent-root 已关闭');
    }
});

// 配置观察选项
observer.observe(targetNode, {
    childList: true,      // 监听子节点添加/删除
    subtree: true         // 监听所有子树
});