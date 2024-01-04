// 中秋节日期（年/月/日）
const midAutumnDate = new Date('2023-09-29T00:00:00');

function updateCountdown() {
    // 获取当前时间
    const now = new Date();

    // 计算距离中秋节的时间差（毫秒）
    const timeRemaining = midAutumnDate - now;

    // 计算天数、小时、分钟和秒数
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // 更新页面上的倒计时元素
    document.getElementById('countdown').innerHTML = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
}

// 每秒调用一次updateCountdown函数，以实时更新倒计时
setInterval(updateCountdown, 1000);

// 初次加载页面时立即更新倒计时
updateCountdown();