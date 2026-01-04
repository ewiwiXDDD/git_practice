/* 1. 初始化圖表 (使用更現代的配色) */
document.addEventListener("DOMContentLoaded", function() {
    // 塑膠圖表
    new Chart(document.getElementById('plasticChart'), {
        type: 'bar',
        data: {
            labels: ['2015', '2018', '2021', '2024'],
            datasets: [{
                label: '塑膠量 (Mt)',
                data: [4.8, 6.2, 8.5, 11.2],
                backgroundColor: 'rgba(0, 229, 255, 0.5)',
                borderColor: '#00e5ff',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: 2000, // 動畫時間延長到 2 秒
                easing: 'easeOutQuart' // 像水流一樣的緩動效果
            },
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#ccc' }, grid: { display: false } }
            }
        }
    });

    // 珊瑚圖表
    new Chart(document.getElementById('coralChart'), {
        type: 'line',
        data: {
            labels: ['1990', '2000', '2010', '2020'],
            datasets: [{
                label: '覆蓋率 %',
                data: [45, 38, 28, 18],
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            animation: {
        duration: 2000, // 動畫時間延長到 2 秒
        easing: 'easeOutQuart' // 像水流一樣的緩動效果
    },
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#ccc' } }
            }
        }
    });

    // 初始化測驗
    initQuiz();
});

/* 2. 地圖切換邏輯 (真實 Embed 連結) */
function updateMap(location, btn) {
    // 切換按鈕樣式
    document.querySelectorAll('.map-menu .list-group-item').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    const frame = document.getElementById('mapFrame');
    // 這些是真實的 Google Maps Embed 連結
    if(location === 'gpgp') {
        // 太平洋中心點示意
        frame.src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13725838.287236683!2d-155.60228076634795!3d36.31936359265243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-TW!2stw!4v1620000000000";
    } else if(location === 'river') {
        // 菲律賓 巴石河
        frame.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.2721016839356!2d120.9816563148408!3d14.58357398981329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca207a390979%3A0x6b4474320662283!2sPasig%20River!5e0!3m2!1szh-TW!2stw!4v1620000000000";
    } else if(location === 'taiwan') {
        // 台灣 基隆嶼
        frame.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.758963249767!2d121.78500631500854!3d25.18873798389966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x345d4f3b7596541f%3A0x8684d0b04602f372!2sKeelung%20Islet!5e0!3m2!1szh-TW!2stw!4v1620000000000";
    }
}

/* 3. 測驗邏輯 (修改版) */
let currentQIndex = 0;
let score = 0;
let currentQuestions = [];

function initQuiz() {
    // --- 🔥 新增安全檢查開始 ---
    // 檢查瀏覽器是否認識 questionBank 這個變數
    if (typeof questionBank === 'undefined') {
        console.error("嚴重錯誤：找不到 questionBank 變數！");
        console.log("請檢查：\n1. HTML 裡 questionBank.js 是否排在 scripts.js 前面？\n2. questionBank.js 裡面是否有語法錯誤(例如少逗號)？");
        
        // 直接在畫面上顯示錯誤給你看，不用猜
        document.getElementById('question-text').innerHTML = 
            "<span style='color:red;'>⚠️ 錯誤：讀取不到題庫資料。<br>請按 F12 查看 Console 錯誤訊息。</span>";
        return; // 停止執行，避免報錯
    }
    // --- 🔥 新增安全檢查結束 ---

    // 重置狀態
    score = 0;
    currentQIndex = 0;
    
    // 隨機選5題 (這裡原本會報錯，現在有上面的檢查保護了)
    currentQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // 顯示測驗區塊
    const quizContainer = document.getElementById('quiz-container');
    const resultArea = document.getElementById('result-area');
    
    // 雙重保險：確認元素存在才操作
    if(quizContainer) quizContainer.classList.remove('d-none');
    if(resultArea) resultArea.classList.add('d-none');
    
    document.getElementById('quiz-status').innerText = "準備好測試你的海洋IQ了嗎？";
    document.getElementById('feedback-area').innerHTML = "";
    
    loadQuestion();
}

function loadQuestion() {
    const q = currentQuestions[currentQIndex];
    document.getElementById('question-text').innerText = `${currentQIndex + 1}. ${q.q}`;
    
    // 更新進度條
    const progress = ((currentQIndex) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    const optsDiv = document.getElementById('options-area');
    optsDiv.innerHTML = ''; // 清空選項

    q.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-light text-start p-3';
        btn.innerHTML = `<span class="badge bg-secondary me-2">${String.fromCharCode(65+idx)}</span> ${opt}`;
        btn.onclick = () => handleAnswer(idx, q.a, q.e, btn);
        optsDiv.appendChild(btn);
    });
}

function handleAnswer(selectedIdx, correctIdx, explanation, btnElement) {
    // 鎖定所有按鈕防止重複點擊
    const allBtns = document.querySelectorAll('#options-area button');
    allBtns.forEach(b => b.disabled = true);

    const feedback = document.getElementById('feedback-area');

    if(selectedIdx === correctIdx) {
        score += 20; // 5題，每題20分
        btnElement.classList.remove('btn-outline-light');
        btnElement.classList.add('btn-success'); // 綠色
        feedback.innerHTML = `<span class="text-success"><i class="fa-solid fa-check-circle"></i> 正確！</span> ${explanation}`;
    }
    else {
        btnElement.classList.remove('btn-outline-light');
        btnElement.classList.add('btn-danger'); // 紅色
        // 標示正確答案
        allBtns[correctIdx].classList.remove('btn-outline-light');
        allBtns[correctIdx].classList.add('btn-success');
        feedback.innerHTML = `<span class="text-danger"><i class="fa-solid fa-times-circle"></i> 答錯了！</span> ${explanation}`;
    }

    // 1.5秒後下一題
    setTimeout(() => {
        currentQIndex++;
        feedback.innerHTML = "";
        if(currentQIndex < currentQuestions.length) {
            loadQuestion();
        }
        else {
            showResult();
        }
    }, 2000);
}

function showResult() {
    document.getElementById('quiz-container').classList.add('d-none');
    document.getElementById('result-area').classList.remove('d-none');
    document.getElementById('final-score').innerText = `${score} 分`;
    document.getElementById('progress-bar').style.width = '100%';
    
    // 根據分數給評語
    const status = document.getElementById('quiz-status');
    if(score === 100) status.innerText = "太強了！你是海洋守護大師！🌊";
    else if(score >= 60) status.innerText = "不錯喔！繼續保持對海洋的關注！🐟";
    else status.innerText = "加油！海洋需要你更多的了解！📚";
}

// js/scripts.js 的最下方

