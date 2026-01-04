/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 改裝版 (海洋保育專題)
*/
window.addEventListener('DOMContentLoaded', event => {

    // --- 1. 側邊欄邏輯 (保持原樣) ---
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // --- 2. 滾動置頂按鈕 (保持原樣) ---
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })

    // --- 3. [新增] 圖表動態觸發要素 ---
    // 使用觀察者模式，當使用者捲動到 Portfolio (圖表區) 時才載入動畫
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initOceanCharts(); // 呼叫下方的圖表初始化
                    observer.unobserve(entry.target); // 觸發後停止觀察
                }
            });
        }, { threshold: 0.15 }); 
        observer.observe(portfolioSection);
    }
})

// --- 4. [新增] Chart.js 圖表初始化 ---
function initOceanCharts() {
    // 塑膠量圖表
    const ctxPlastic = document.getElementById('plasticChart');
    if (ctxPlastic) {
        new Chart(ctxPlastic, {
            type: 'bar',
            data: {
                labels: ['2015', '2018', '2021', '2024'],
                datasets: [{
                    label: '百萬噸 (Mt)',
                    data: [4.8, 6.2, 8.5, 11.2],
                    backgroundColor: 'rgba(29, 128, 159, 0.7)',
                    borderColor: 'rgb(29, 128, 159)',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, animation: { duration: 2500 } }
        });
    }

    // 珊瑚圖表
    const ctxCoral = document.getElementById('coralChart');
    if (ctxCoral) {
        new Chart(ctxCoral, {
            type: 'line',
            data: {
                labels: ['1990', '2000', '2010', '2020'],
                datasets: [{
                    label: '覆蓋率 %',
                    data: [45, 38, 28, 18],
                    fill: true,
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderColor: '#e74c3c',
                    tension: 0.4
                }]
            },
            options: { responsive: true, animation: { duration: 2500 } }
        });
    }
}

// --- 5. [新增] 互動遊戲邏輯 ---
function checkAnswer(isCorrect) {
    const feedback = document.getElementById('quiz-feedback');
    if (!feedback) return;
    
    if (isCorrect) {
        feedback.innerHTML = "✨ <b>答對了！</b> 透明塑膠袋常被海龜誤認為水母，造成致命傷害。";
        feedback.style.color = "#2ecc71"; // 成功綠
    } else {
        feedback.innerHTML = "❌ <b>再想想！</b> 雖然漁網也很危險，但塑膠袋的誤食率最高。";
        feedback.style.color = "#f1c40f"; // 警告黃
    }
    fadeIn(feedback);
}

// --- 6. 原有的淡入淡出函數 (保持原樣) ---
function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};