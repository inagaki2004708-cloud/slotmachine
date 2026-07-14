// ゲーム状態管理変数
  let activeBet = 3;
  let credits = 0;
  let handCoins = 0;
  let gameCount = 0;
  let displayGameCount = 0; 
  let betAmount = 0;
  let lastSpinTime = 0;
  let isSpinning = [false, false, false];
  let spinFrameIds = [null, null, null];    
  let lastReelUpdateTimes = [0, 0, 0];
  let currentSymbols = [1, 1, 1];
  let currentFlag = 0; 
  let targetSymbols = [0, 0, 0];
  let stopCount = 0;
  let isNejiriWait = false;
  let isStopAnimFinished = false;
  let renchanRemaining = 0;       
  let isForcedRenchan = false;    
  let nextBonusGameCount = 0; 
  let isBonusEnding = false;
  let currentBonusType = null; 
  let maxBonusPayout = 0;
  let bbCount = 0; 
  let rbCount = 0; 
  let audioCtx = null;
  let flashAudioBuffer = null;
  let currentPos = [0, 0, 0]; 
    const SPEED_PER_MS = 1 / 35;
  let isPremiumMute = false;
  let totalInvestment = 0; 
  
  // 3つのリールの図柄配列
  const reelStrips = [
    ['bell', '7', 'replay', 'grape', 'replay', 'grape', 'bar', 'cherry', 'grape', 'replay', 'grape', '7', 'clown', 'grape', 'replay', 'grape', 'cherry', 'bar', 'grape', 'replay', 'grape'],
    ['replay', '7', 'grape', 'cherry', 'replay', 'bell', 'grape', 'cherry', 'replay', 'bar', 'grape', 'cherry', 'replay', 'bell', 'grape', 'cherry', 'replay', 'bar', 'grape', 'cherry', 'clown'],
    ['grape', '7', 'bar', 'bell', 'replay', 'grape', 'clown', 'bell', 'replay', 'grape', 'clown', 'bell', 'replay', 'grape', 'clown', 'bell', 'replay', 'grape', 'clown', 'bell', 'replay']
  ];

  // 図柄名と画像ファイルパスの対応
  const symbolImages = {
    '7': 'image/7.png',
    'bar': 'image/bar.png',
    'grape': 'image/grape.png',
    'cherry': 'image/cherry.png',
    'bell': 'image/bell.png',
    'replay': 'image/rhinoceros.png',
    'clown': 'image/miniclown.png'
  };

  // ウェイト制御用変数
  let lastStartTime = 0;
  let waitTimeout = null;
  const creditDisplay = document.getElementById('creditDisplay');
  const countDisplay = document.getElementById('countDisplay');
  const payoutDisplay = document.getElementById('payoutDisplay');
  const gameCountDisplay = document.getElementById('gameCountDisplay');
  const handCoinsDisplay = document.getElementById('handCoinsDisplay'); 
  const gogoLamp = document.getElementById('gogoLamp');
  const btnBet = document.getElementById('btnBet');
  const btnStart = document.getElementById('btnStart');
  const btnStops = [document.getElementById('btnStop0'), document.getElementById('btnStop1'), document.getElementById('btnStop2')];
  const reelElements = [document.getElementById('reel0'), document.getElementById('reel1'), document.getElementById('reel2')];
  const indStart = document.getElementById('indStart');
  const indReplay = document.getElementById('indReplay');
  const indWait = document.getElementById('indWait');
  const indInsertMedals = document.getElementById('indInsertMedals');
  const panelStops = [document.getElementById('panelStop0'), document.getElementById('panelStop1'), document.getElementById('panelStop2')];
  const btnSingleBet = document.getElementById('btnSingleBet');

  // 成立役の定数定義
  const FLAGS = {
    HAZURE:  'HAZURE',
    REPLAY:  'REPLAY',
    GRAPE:   'GRAPE',
    CHERRY:  'CHERRY',
    CHERRY_BIG: 'CHERRY_BIG',  
    CHERRY_REG: 'CHERRY_REG',  
    CLOWN:   'CLOWN',
    BELL:    'BELL',
    BIG:     'BIG',
    REG:     'REG',
    BAR_REACH: 'BAR_REACH',
    MIDDLE_CHERRY: 'MIDDLE_CHERRY'
  };

  // ゲームの状態定義
  const STATES = {
    IDLE:     'STATE_IDLE',
    BET:      'STATE_BET',
    SPIN:     'STATE_SPIN',
    STOPPING: 'STATE_STOPPING',
    PAYOUT:   'STATE_PAYOUT',
    BIG_BONUS: 'STATE_BIG_BONUS',
    REG_BONUS: 'STATE_REG_BONUS'
  };
    const REACH_PATTERNS = [
    ['bar', 'bar', 'bar'],
    ['bar', 'bar', '7'],
    ['7', 'bar', 'bar'],
    ['bar', '7', '7'],
    ['bar', '7', 'bar'],
    ['7', 'bar', '7'],
    ['clown', '7', 'clown'],
    ['clown', 'bar', 'clown'],
    ['7', 'clown', 'clown'],
    ['clown', 'clown', '7']
  ];

  const PROBABILITY_TABLE = {
  1: { big: 163, c_big: 45, reg: 100, c_reg: 49, grape: 10880, replay: 8978, cherry: 1840, bell: 64, clown: 64 },
  2: { big: 164, c_big: 46, reg: 108, c_reg: 53, grape: 10922, replay: 8978, cherry: 1840, bell: 64, clown: 64 },
  3: { big: 164, c_big: 46, reg: 131, c_reg: 61, grape: 10965, replay: 8978, cherry: 1840, bell: 64, clown: 64 },
  4: { big: 168, c_big: 50, reg: 146, c_reg: 62, grape: 11009, replay: 8978, cherry: 1840, bell: 64, clown: 64 },
  5: { big: 168, c_big: 50, reg: 170, c_reg: 87, grape: 11054, replay: 8978, cherry: 1840, bell: 64, clown: 64 },
  6: { big: 170, c_big: 87, reg: 170, c_reg: 87, grape: 11340, replay: 8978, cherry: 1840, bell: 64, clown: 64 }
};
let isAutoPlay = false;
  let autoPlayTimer = null;
  let isAutoSystemCalling = false;
  let currentSettingLevel = Math.floor(Math.random() * 6) + 1; 
  let currentGameFlag = FLAGS.HAZURE; 
  let isBonusInternal = false;        
  let currentState = STATES.IDLE;     
  let bonusPayoutRemaining = 0; 
  let internalBonusType = null;
  let bonusTotalPayout = 0;
  let currentDiff = 0; 
  let slumpData = [{ game: 0, diff: 0 }]; 
  let lastGraphUpdateGame = 0;

    function changeState(newState) {
    currentState = newState;
    
    const btnBet = document.getElementById('btnBet');
    const btnSingleBet = document.getElementById('btnSingleBet');
    const btnStart = document.getElementById('btnStart');
    const machineSingleBtn = document.getElementById('machineSingleBtn');
    const machineStartBtn = document.getElementById('machineStartBtn');
    const machineResetBtn = document.getElementById('machineResetBtn'); 
    const stopButtons = [
      document.getElementById('btnStop0'), document.getElementById('btnStop1'), document.getElementById('btnStop2'),
      document.getElementById('panelStop0'), document.getElementById('panelStop1'), document.getElementById('panelStop2')
    ];

    // 全ボタンを一旦リセット（押せなくする）
    btnBet.disabled = true;
    btnSingleBet.disabled = true;
    machineSingleBtn.disabled = true; 
    btnStart.disabled = true;
    machineStartBtn.disabled = true;
    if (machineResetBtn) machineResetBtn.disabled = true;
    stopButtons.forEach(b => b.disabled = true);

    switch (currentState) {
      case STATES.IDLE: // 通常待機中
        btnBet.disabled = false;
        btnSingleBet.disabled = false;
        
        // ▼▼ 追加箇所：待機中は機体の1枚掛けとリセットを有効化 ▼▼
        machineSingleBtn.disabled = false; 
        if (machineResetBtn) machineResetBtn.disabled = false; 
        
        indInsertMedals.classList.add('on');
        indStart.classList.remove('on');
        break;

      case STATES.BET: // BET後
        btnStart.disabled = false;
        machineStartBtn.disabled = false;
        
        // ▼▼ 追加箇所：BET後も取り消しできるようにリセットを有効化 ▼▼
        if (machineResetBtn) machineResetBtn.disabled = false; 

        indInsertMedals.classList.remove('on');
        indStart.classList.add('on');
        break;

      case STATES.SPIN: // 回転中
        stopButtons.forEach(b => b.disabled = false);
        indInsertMedals.classList.remove('on');
        indStart.classList.remove('on');
        break;

      case STATES.STOPPING: // 停止操作中
        for (let i = 0; i < 3; i++) {
          if (isSpinning[i]) {
            document.getElementById('btnStop' + i).disabled = false;
            document.getElementById('panelStop' + i).disabled = false;
          }
        }
        break;

      case STATES.PAYOUT: // 払い出し中・処理中
        break;
    }
  }
// ▼▼ 入金モーダル関連の処理 ▼▼

// 入金画面を開く
function openDepositModal() {
  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.style.display = 'flex'; // stat-overlayがflexを利用しているため
  }
}

// 入金画面を閉じる
function closeDepositModal() {
  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

 // 入金処理の実行
function processDeposit(price, coinsToAdd) {
  credits += coinsToAdd; 
  
  // 累計投資額に加算する処理を追加
  totalInvestment += price;
  
  // ▼ クレジットが最大値(50)を超えた場合、超過分を所持枚数(handCoins)に加算
  if (credits > 50) {
    handCoins += (credits - 50);
    credits = 50;
  }
  
  // ▼ 画面の表示(クレジット・所持枚数など)をまとめて更新
  updateDisplay();
  
  console.log(`${price}円入金されました。追加枚数: ${coinsToAdd}枚`);
  
  // 入金完了後、モーダルを閉じる
  closeDepositModal();
}


  function startSpin() {
    if (credits + handCoins<= 0 && betAmount <= 0) {
    openDepositModal();
    return;
  }
    const btnStart = document.getElementById('btnStart');
if (btnStart) {
  btnStart.classList.add('lever-down');
  setTimeout(() => btnStart.classList.remove('lever-down'), 100);
    if (isAutoPlay && !isAutoSystemCalling) return;

    if (isSpinning[0] || isSpinning[1] || isSpinning[2] || isBonusEnding) return;
    if (currentState !== STATES.BET) return;
    const now = Date.now();
    const elapsed = now - lastStartTime;
    const waitTime = Math.max(0, 4100 - elapsed);

    if (waitTime > 0) {
      indWait.classList.add('on'); // Waitランプ点灯
      changeState(STATES.PAYOUT);   // 一時的に操作をロック
      
      setTimeout(() => {
        indWait.classList.remove('on'); // 待機終了で消灯
        executeSpin(); // 実際の回転処理へ
      }, waitTime);
    } else {
      executeSpin();
    }
  }
}
  function updateStatisticsDisplay() {
    const totalBonus = bbCount + rbCount;
    const totalProb = totalBonus > 0 ? Math.round(gameCount / totalBonus) : 0;

    // HTMLの各項目に数値をセット
    document.getElementById('statTotalBonus').innerText = totalBonus;
    document.getElementById('statTotalGames').innerText = gameCount;
    document.getElementById('statCurrentGames').innerText = displayGameCount;
    document.getElementById('statCoins').innerText = handCoins + credits; 
    document.getElementById('statBBCount').innerText = bbCount;
    document.getElementById('statRBCount').innerText = rbCount;
    document.getElementById('statTotalProb').innerText = totalProb > 0 ? totalProb : '-';

    // ==========================================
    // ▼ 【追加】投資額と現在の収支を計算・表示
    // ==========================================
    const totalCoins = handCoins + credits;      // 現在の総メダル数（手持ち＋クレジット）
    const currentAsset = totalCoins * 20;        // 1枚 ＝ 20円換算
    const currentBalance = currentAsset - totalInvestment; // 収支 ＝ 現在のメダル価値 － 投資総額

    // 投資金額をカンマ区切りで表示
    const investmentEl = document.getElementById('statInvestment');
    if (investmentEl) {
      investmentEl.innerText = totalInvestment.toLocaleString();
    }

    // 収支をカンマ区切りで表示（プラスなら '+' をつけ、状況に合わせて色を変更）
    const balanceEl = document.getElementById('statBalance');
    if (balanceEl) {
      if (currentBalance > 0) {
        balanceEl.innerText = '+' + currentBalance.toLocaleString();
        balanceEl.style.color = '#ff3b30'; // プラス収支は赤色
      } else if (currentBalance < 0) {
        balanceEl.innerText = currentBalance.toLocaleString();
        balanceEl.style.color = '#4488ff'; // マイナス収支は青色
      } else {
        balanceEl.innerText = '0';
        balanceEl.style.color = '#ffffff'; // 収支ゼロは白色
      }
    }
    // ==========================================

    // もし統計画面が開いたままなら、スランプグラフもリアルタイム更新する
    const statOverlay = document.getElementById('statOverlay');
    if (statOverlay && statOverlay.style.display === 'flex') {
      drawSlumpGraph();
    }
  }

  // 統計画面を開く処理
  function openStatistics() {
    updateStatisticsDisplay(); // 開く直前に最新化
    document.getElementById('statOverlay').style.display = 'flex';
    drawSlumpGraph(); // 表示時にグラフを描画
  }

// ▼▼ 追加：スランプグラフを描画する関数 ▼▼
function drawSlumpGraph() {
  const canvas = document.getElementById('slumpGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // キャンバスのクリアと背景
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);

  // 余白の設定
  const margin = { top: 20, right: 20, bottom: 25, left: 45 };
  const drawWidth = width - margin.left - margin.right;
  const drawHeight = height - margin.top - margin.bottom;

  // 横軸の最大値（最低100G、100G単位）
  const maxGame = Math.max(100, Math.ceil(gameCount / 100) * 100);

  // 縦軸の最大・最小値を500単位で設定
  let maxDiff = 500;
  let minDiff = -500;
  for (const d of slumpData) {
    if (d.diff > maxDiff) maxDiff = Math.ceil(d.diff / 500) * 500;
    if (d.diff < minDiff) minDiff = Math.floor(d.diff / 500) * 500;
  }
  if (currentDiff > maxDiff) maxDiff = Math.ceil(currentDiff / 500) * 500;
  if (currentDiff < minDiff) minDiff = Math.floor(currentDiff / 500) * 500;

  const scaleX = drawWidth / maxGame;
  const scaleY = drawHeight / (maxDiff - minDiff);

  ctx.lineWidth = 1;
  ctx.font = '10px Arial';

  // --- 縦軸グリッド（500枚毎） ---
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = minDiff; y <= maxDiff; y += 500) {
    const yPos = margin.top + drawHeight - (y - minDiff) * scaleY;
    ctx.beginPath();
    ctx.strokeStyle = y === 0 ? '#666' : '#222'; // 0枚の線を少し明るく
    ctx.moveTo(margin.left, yPos);
    ctx.lineTo(width - margin.right, yPos);
    ctx.stroke();
    
    // 文字色（プラスはオレンジ、マイナスは青）
    ctx.fillStyle = y >= 0 ? '#ffaa00' : '#00e5ff'; 
    ctx.fillText(y, margin.left - 5, yPos);
  }

  // --- 横軸グリッド（100G毎） ---
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ccc';
  ctx.strokeStyle = '#222';
  for (let x = 0; x <= maxGame; x += 1000) {
    const xPos = margin.left + x * scaleX;
    ctx.beginPath();
    ctx.moveTo(xPos, margin.top);
    ctx.lineTo(xPos, height - margin.bottom);
    ctx.stroke();
    ctx.fillText(x, xPos, height - margin.bottom + 5);
  }

  // --- スランプグラフの折れ線（10G毎） ---
  ctx.strokeStyle = '#5eff5e'; // 緑色のライン
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < slumpData.length; i++) {
    const d = slumpData[i];
    const xPos = margin.left + d.game * scaleX;
    const yPos = margin.top + drawHeight - (d.diff - minDiff) * scaleY;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  // 最後に最新のゲーム数の位置まで繋ぐ
  if (gameCount > 0 && gameCount !== slumpData[slumpData.length - 1].game) {
    const currentX = margin.left + gameCount * scaleX;
    const currentY = margin.top + drawHeight - (currentDiff - minDiff) * scaleY;
    ctx.lineTo(currentX, currentY);
  }
  ctx.stroke();
}

// ▼ 追加箇所：設定メニュー関連の関数
  function openSetting() {
    document.getElementById('currentSettingDisplay').innerText = currentSettingLevel;
    document.getElementById('settingOverlay').style.display = 'flex';
  }

  function closeSetting() {
    document.getElementById('settingOverlay').style.display = 'none';
  }

  function changeSetting(level) {
    currentSettingLevel = level;
    document.getElementById('currentSettingDisplay').innerText = currentSettingLevel;
    // 必要であればここで設定変更音を鳴らすなどの処理も可能です
  }
  function closeStatistics() {
    // オーバーレイを非表示にする
    document.getElementById('statOverlay').style.display = 'none';
  }
  function executeSpin() {
    lastStartTime = Date.now();

    document.querySelectorAll('.blink-anim').forEach(img => img.classList.remove('blink-anim'));
    activeBet = betAmount;
    const currentBet = betAmount;
    betAmount = 0;
    indReplay.classList.remove('on');
    isStopAnimFinished = false;
    document.querySelector('.reels-window').classList.add('spinning');
    
    const BONUS_PROBABILITY_TABLE = {
      grape: 58000, 
      cherry: 7536  
    };

    // ▼▼ 修正箇所：ボーナス中と通常時で処理を完全に分ける ▼▼
    if (bonusPayoutRemaining > 0) { 
      // ボーナス中の抽選（ぶどうとチェリーを別々に抽選）
      const randBonus = Math.floor(Math.random() * 65536);
      if (randBonus < 2000) { 
        // 2000/65536 = 約1/32 の確率でチェリー
        currentGameFlag = FLAGS.CHERRY;
      } else {
        // 残りはすべてぶどう
        currentGameFlag = FLAGS.GRAPE;
      }
    } else {      // ーーー ここから下はすべてボーナス中以外（通常時）のみ実行 ーーー      
      // ▼ ジャグ連（強制ボーナス）の判定 ▼
      if (isForcedRenchan && gameCount === nextBonusGameCount) {
        currentGameFlag = Math.random() < 0.6 ? FLAGS.BIG : FLAGS.REG;
        isBonusInternal = true;
        internalBonusType = currentGameFlag;
        isForcedRenchan = false; 
      } else {
        const rand = Math.floor(Math.random() * 65536); 
        let prob = { ...PROBABILITY_TABLE[currentSettingLevel] };
        
        if (currentBet === 1) {
          prob.grape = 2324;
          prob.bell = 4;
          prob.clown = 4;
          prob.replay = 8978; 
        }
        
        if (isBonusInternal) {
          if (rand < prob.grape) currentGameFlag = FLAGS.GRAPE;
          else if (rand < prob.grape + prob.replay) currentGameFlag = FLAGS.REPLAY;
          else if (rand < prob.grape + prob.replay + prob.cherry) currentGameFlag = FLAGS.CHERRY;
          else currentGameFlag = internalBonusType;
        } else {
          let acc = 0;
          const hit = (p, flag) => {
            acc += p;
            if (currentGameFlag !== FLAGS.HAZURE) return; 
            if (rand < acc) currentGameFlag = flag;
          };

          currentGameFlag = FLAGS.HAZURE;
          hit(20, FLAGS.MIDDLE_CHERRY);
          hit(prob.big,    FLAGS.BIG);
          hit(prob.c_big,  FLAGS.CHERRY_BIG); 
          hit(prob.reg,    FLAGS.REG);
          hit(prob.c_reg,  FLAGS.CHERRY_REG); 
          hit(prob.grape,  FLAGS.GRAPE);
          hit(prob.replay, FLAGS.REPLAY);
          hit(prob.cherry, FLAGS.CHERRY);
          hit(prob.bell,   FLAGS.BELL);
          hit(prob.clown,  FLAGS.CLOWN);
          
          if (currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.MIDDLE_CHERRY) {
            isBonusInternal = true;
            internalBonusType = FLAGS.BIG;
          } else if (currentGameFlag === FLAGS.REG || currentGameFlag === FLAGS.CHERRY_REG) {
            isBonusInternal = true;
            internalBonusType = FLAGS.REG;
          }
        }
      }
    } 
    
    currentFlag = (currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.REG) ? 5 : 0;
    
    // ランプが未点灯の時のみ判定
    if ((currentFlag === 5 || isBonusInternal) && 
        !gogoLamp.classList.contains('on') && 
        !gogoLamp.classList.contains('rainbow') &&
        !gogoLamp.classList.contains('premium-only-gogo') &&
        !gogoLamp.classList.contains('premium-only-chance')) {
      
      // 先告知の発生確率（25%）
      if (Math.random() < 0.25) { 
        if (internalBonusType === FLAGS.BIG) {
          // BIG確定時のプレミア振り分け (例: 各5%の確率でプレミア選択)
          const premiumRand = Math.random();
          if (premiumRand < 0.05) {
            gogoLamp.classList.add('rainbow');
          } else if (premiumRand < 0.10) {
            gogoLamp.classList.add('premium-only-gogo');
          } else if (premiumRand < 0.15) {
            gogoLamp.classList.add('premium-only-chance');
          } else {
            gogoLamp.classList.add('on'); // 通常点灯
          }
        } else {
          // REGの場合は必ず通常点灯
          gogoLamp.classList.add('on');
        }
      }
    }
    gameCount++;
    if (bonusPayoutRemaining <= 0 && !isBonusEnding) {
      displayGameCount++;
    }
    updateDisplay();
    changeState(STATES.SPIN);

    // ==========================================
    // ▼▼ プレミアム演出（無音・遅れ）の抽選と再生 ▼▼
    // ==========================================
    let isSilent = false;
    let isDelay = false;

    // ① 無音判定：BIGフラグ成立時（または内部BIG中）の 5% で発生
    const isBigFlag = (currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.CHERRY_BIG || (isBonusInternal && internalBonusType === FLAGS.BIG));
    if (isBigFlag && Math.random() < 0.05) {
      isSilent = true;
    } 
    // ② 遅れ判定：チェリーフラグ時、またはボーナス成立時の 5% で発生
    else if ((currentGameFlag === FLAGS.CHERRY || isBonusInternal) && Math.random() < 0.05) {
      isDelay = true;
    }

    if (isSilent) {
      // プレミアム【無音】：スタート音を鳴らさない（BIG確定）
      console.log("プレミアム演出：無音！(BIG確定)");
    } else if (isDelay) {
      // プレミアム【遅れ】：0.3秒遅れてスタート音を鳴らす
      console.log("プレミアム演出：遅れ！(チェリー or ボーナス)");
      setTimeout(() => {
        sndStart.currentTime = 0;
        sndStart.play();
      }, 300);
    } else {
      // 【通常】
      sndStart.currentTime = 0;
      sndStart.play();
    }
    // ==========================================

    for (let i = 0; i < 3; i++) {
      isSpinning[i] = true;
      if (spinFrameIds[i]) cancelAnimationFrame(spinFrameIds[i]);
      lastReelUpdateTimes[i] = performance.now();

      const spinLoop = (timestamp) => {
        if (!isSpinning[i]) return;

        const elapsed = timestamp - lastReelUpdateTimes[i];
        lastReelUpdateTimes[i] = timestamp;

        // スピード分だけ座標を減らす（リールは下へ進む＝インデックスが減る）
        currentPos[i] -= elapsed * SPEED_PER_MS;

        const len = reelStrips[i].length;
        // シームレス処理：1周目の領域に入ったら、見た目を変えずに2周目へワープ
        if (currentPos[i] < len) {
          currentPos[i] += len;
        }

        // 役判定用に整数の currentSymbols も更新しておく
        currentSymbols[i] = Math.round(currentPos[i]) % len;

        updateReelDisplay(i, currentPos[i]);
        spinFrameIds[i] = requestAnimationFrame(spinLoop);
      };

      spinFrameIds[i] = requestAnimationFrame(spinLoop);
    }
  }
  
        

  const audioFiles = {
    maxBet: 'bgm/maxbet.mp3',
    stop: 'bgm/button.mp3',     
    start: 'bgm/start.mp3',
    flash: 'bgm/flash.mp3',     
    replay: 'bgm/replay.mp3',
    payout: 'bgm/payout.mp3',
    tenpai: 'bgm/tenpai.mp3'
  };

  const sndMaxBet = new Audio(audioFiles.maxBet);
  const sndStop   = new Audio(audioFiles.stop);
  const sndStart  = new Audio(audioFiles.start);
  const sndFlash  = new Audio(audioFiles.flash);
  const sndReplay = new Audio(audioFiles.replay);
  const sndPayout = new Audio(audioFiles.payout); 
  sndPayout.loop = true;
  const sndTenpai = new Audio(audioFiles.tenpai); 

  // ボーナス用BGMの定義
  const sndStartBonus = new Audio('bgm/startbonus.mp3');
  const sndBigBonus = new Audio('bgm/bigbonus.mp3');
  const sndRegBonus = new Audio('bgm/regbonus.mp3'); 
  const sndBonusFinish = new Audio('bgm/bonusfinish.mp3'); 
  
  sndBigBonus.loop = true;
  sndRegBonus.loop = true;

  const allSounds = [sndMaxBet, sndStop, sndStart, sndFlash, sndReplay,sndStartBonus, sndBigBonus, sndRegBonus, sndBonusFinish, sndPayout, sndTenpai];
  allSounds.forEach(audio => {
    audio.preload = 'auto';
    audio.load();
  });

  let isAudioUnlocked = false;
  function unlockAudio() {
    if (isAudioUnlocked) return;
    allSounds.forEach(sound => {
    if (sound === sndMaxBet) return;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          sound.pause();
          sound.currentTime = 0;
        }).catch(e => {
          console.log("Audio deferred:", e);
        });
      }
    });
    isAudioUnlocked = true;
  }
 
    function updateDisplay() {
     creditDisplay.innerText = credits;
     if (gameCountDisplay) gameCountDisplay.innerText = displayGameCount;
     if (handCoinsDisplay) handCoinsDisplay.innerText = handCoins; 
     if (bonusPayoutRemaining > 0 || isBonusEnding || bonusTotalPayout > 0) {
      countDisplay.innerText = bonusTotalPayout;
    } else {
      countDisplay.innerText = ""; 
    }
    updateStatisticsDisplay();
  }

 function updateReelDisplay(reelIndex, position) {
  const tape = document.getElementById('reelTape' + reelIndex);
  const totalCells = reelStrips[reelIndex].length * 3; // 63コマ
  const offset = -1; 
  
  // 整数ではなく、小数の position を使って滑らかに％を計算
  const percentage = ((position + offset) / totalCells) * 100;
  
  tape.style.transform = `translateY(-${percentage}%) translateZ(0)`;
}
  
  function getStopPosition(reelIndex, pressIdx) {
    const strip = reelStrips[reelIndex];
    const len = strip.length;
    const isFirstStop = (stopCount === 0);
    const isThirdStop = (stopCount === 2);
        
    // 有効な5ラインのインデックス定義
    let LINES = [];
if (activeBet === 1) {
  LINES = [ [1, 1, 1] ]; // 中段のみ
} else if (activeBet === 2) {
  LINES = [ [0, 0, 0], [1, 1, 1], [2, 2, 2] ]; // 上・中・下段のみ
} else {
  LINES = [ [0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 1, 2], [2, 1, 0] ]; // 全5ライン
}

    // すでに停止しているリールの状態を取得
    const board = [null, null, null];
    for (let r = 0; r < 3; r++) {
      if (!isSpinning[r]) {
        const tIdx = targetSymbols[r];
        board[r] = [
          reelStrips[r][(tIdx - 1 + len) % len],
          reelStrips[r][tIdx],
          reelStrips[r][(tIdx + 1) % len]
        ];
      }
    }

    // --- 【修正】ボーナスフラグの厳密な判定 ---
    const isInternalBig = (isBonusInternal && internalBonusType === FLAGS.BIG) || 
                          (currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.MIDDLE_CHERRY);
    const isInternalReg = (isBonusInternal && internalBonusType === FLAGS.REG) || 
                          (currentGameFlag === FLAGS.REG || currentGameFlag === FLAGS.CHERRY_REG);
    const isBonus = isInternalBig || isInternalReg;

    // --- 成立役のターゲット図柄を定義 ---
    let targetSym = null;
    if (currentGameFlag === FLAGS.GRAPE) targetSym = 'grape';
    else if (currentGameFlag === FLAGS.REPLAY) targetSym = 'replay';
    else if (currentGameFlag === FLAGS.BELL) targetSym = 'bell';
    else if (currentGameFlag === FLAGS.CLOWN) targetSym = 'clown';

    let slideCandidates = []; // 各滑り数の評価を格納する配列

    // 0〜4コマの滑りを全てシミュレーションし、結果を分類する
    for (let slide = 0; slide <= 4; slide++) {
      const testIdx = (pressIdx - slide + len) % len;
      const testReel = [
        strip[(testIdx - 1 + len) % len], 
        strip[testIdx],                   
        strip[(testIdx + 1) % len]        
      ];

      const testBoard = [...board];
      testBoard[reelIndex] = testReel;

      let hasUnauthorizedWin = false; // 成立していない役が揃ってしまうか
      let hasTargetSmallRole = false; // 成立している小役を引き込めたか
      let hasBonusWin = false;        // ボーナスが揃ったか
      let isBonusTenpai = false;      // ボーナスがテンパイしたか
      let hasSubstitute = false;      // 代役（リーチ目用図柄）が枠内にあるか

      LINES.forEach(line => {
        const s0 = testBoard[0] ? testBoard[0][line[0]] : null;
        const s1 = testBoard[1] ? testBoard[1][line[1]] : null;
        const s2 = testBoard[2] ? testBoard[2][line[2]] : null;
        const currentLine = [s0, s1, s2].filter(s => s !== null);
        
        const isCompleted = currentLine.length === 3;
        const isTenpai = currentLine.length === 2;
        const isMatch = (sym1, sym2, sym3) => (sym1 === sym2 && sym2 === sym3);

        // 【修正】実際の図柄の揃い方を個別に判定
        const isActualBigPattern = isCompleted && isMatch(s0, s1, s2) && s0 === '7';
        const isActualRegPattern = isCompleted && s0 === '7' && s1 === '7' && s2 === 'bar';
        const isSmallRolePattern = isCompleted && isMatch(s0, s1, s2) && s0 !== '7' && s0 !== 'bar';
        
        // --- ① 蹴飛ばし（ペナルティ）判定 ---
        if (currentGameFlag === FLAGS.HAZURE) {
          if (isActualBigPattern || isActualRegPattern || isSmallRolePattern) hasUnauthorizedWin = true;
        } else {
          // 内部フラグと一致しないボーナス揃いはペナルティ（無効）とする
          if (isActualBigPattern && !isInternalBig) hasUnauthorizedWin = true;
          if (isActualRegPattern && !isInternalReg) hasUnauthorizedWin = true;
          if (isSmallRolePattern && s0 !== targetSym) hasUnauthorizedWin = true;
        }

        // --- ② 役の引き込み・テンパイ判定 ---
        if (targetSym && isSmallRolePattern && s0 === targetSym) hasTargetSmallRole = true;
        
        // 成立している側のボーナスのみを引き込み対象とする
        if (isInternalBig && isActualBigPattern) hasBonusWin = true;
        if (isInternalReg && isActualRegPattern) hasBonusWin = true;
        
        if (isTenpai) {
          if (targetSym && currentLine[0] === currentLine[1] && currentLine[0] === targetSym) hasTargetSmallRole = true;
          // ボーナス内部成立時は7テンパイを意識
          if (isBonus && currentLine[0] === '7' && currentLine[1] === '7') isBonusTenpai = true;
        }

        // ▼ 追加：第1停止時（図柄が1つだけの状態）でもターゲット図柄を有効ラインに引き込む
        if (currentLine.length === 1 && targetSym && currentLine[0] === targetSym) {
          hasTargetSmallRole = true;
        }
      });

      // --- ③ チェリー固有の制御 ---
      // 左リールの引き込み処理
      if (reelIndex === 0) {
        const hasCherry = testReel.includes('cherry');
        const isMiddleCherry = testReel[1] === 'cherry';
        
        if (currentGameFlag === FLAGS.CHERRY || currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.CHERRY_REG) {
          if (hasCherry && !isMiddleCherry) hasTargetSmallRole = true; 
          if (isMiddleCherry) hasUnauthorizedWin = true;         
        } else if (currentGameFlag === FLAGS.MIDDLE_CHERRY) {
          if (isMiddleCherry) hasTargetSmallRole = true;
          if (hasCherry && !isMiddleCherry) hasUnauthorizedWin = true;
        } else {
          // チェリーフラグ以外ではチェリーを引き込まない（滑って回避させる）
          if (hasCherry && !isBonus) hasUnauthorizedWin = true; 
        }
      }

      // ▼▼ 追加：中・右リールの「単チェリー」「連チェリー」制御 ▼▼
      if (reelIndex === 1 || reelIndex === 2) {
        // すでに左リールにチェリーが停止しているか確認
        let isLeftCherry = board[0] && (board[0][0] === 'cherry' || board[0][1] === 'cherry' || board[0][2] === 'cherry');
        
        if (isLeftCherry) {
          const hasCherryInTest = testReel.includes('cherry');
          
          // ▼ 修正：ボーナス中のチェリー (bonusPayoutRemaining > 0) も単チェリー扱いにする
          if (currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.CHERRY_REG || (currentGameFlag === FLAGS.CHERRY && bonusPayoutRemaining > 0)) {
            // ボーナス重複時、またはボーナス中のチェリーは【単チェリー】を作りたいので、チェリーを引き込まない（ペナルティ）
            if (hasCherryInTest) hasUnauthorizedWin = true; 
            else hasSubstitute = true; 
          } else if (currentGameFlag === FLAGS.CHERRY) {
            // 通常時のチェリーは【連チェリー】を作りたいので、チェリーを積極的に引き込む
            if (hasCherryInTest) hasTargetSmallRole = true;
          }
        }
      }

      // --- ④ 代役（リーチ目）の判定 ---
      if (isBonus && !hasBonusWin && !isBonusTenpai) {
        // ボーナス内部成立中で揃えられない場合は、BARなどを引き込んでリーチ目を形成しやすくする
        if (testReel.includes('bar')) {
          hasSubstitute = true;
        }
      }

      // ▼▼ スコアリング（評価）処理 ▼▼
      if (!hasUnauthorizedWin) {
        let score = 0;

        if (stopCount === 0) {
          if (hasTargetSmallRole) score += 1000;
          if (hasSubstitute) score += 500;
          if (hasBonusWin) score += 300; 
          if (isBonus && (testReel.includes('7') || testReel.includes('bar'))) {
            score += 700;
          }
        } 
        else if (stopCount === 1) {
          if (hasTargetSmallRole) score += 1000;
          if (isBonusTenpai) score += 800;
          if (hasSubstitute) score += 500;
          if (isBonus && (testReel.includes('7') || testReel.includes('bar'))) {
            score += 700;
          }
        } 
        else if (stopCount === 2) {
          if (hasBonusWin) score += 1000;
          if (hasTargetSmallRole) score += 800; 
          if (hasSubstitute) score += 300;
        }

        slideCandidates.push({ slide, score });
      }
    } // -- forループここまで --

    // ▼▼ スベリ数の最終決定 ▼▼
    let finalSlide = 0;

    if (slideCandidates.length > 0) {
      const maxScore = Math.max(...slideCandidates.map(c => c.score));
      const bestCandidates = slideCandidates.filter(c => c.score === maxScore);

      if (isBonus && stopCount === 2 && maxScore > 0) {
        finalSlide = Math.max(...bestCandidates.map(c => c.slide));
      } else {
        finalSlide = Math.min(...bestCandidates.map(c => c.slide));
      }
    } else {
      let bestSlide = 0;
      if (!isBonus) {
        for (let slide = 0; slide <= 4; slide++) {
          const testIdx = (pressIdx - slide + len) % len;
          if (strip[testIdx] !== '7' && strip[testIdx] !== 'bar') {
            bestSlide = slide;
            break;
          }
        }
      }
      finalSlide = bestSlide;
    }

    return (pressIdx - finalSlide + len) % len;
  }

  function stopSpin(reelIndex) {
    if (!isSpinning[reelIndex]) return;
    if (isAutoPlay && !isAutoSystemCalling) return;

    // 停止音の再生
    sndStop.currentTime = 0;
    sndStop.play();

    isSpinning[reelIndex] = false;
    if (spinFrameIds[reelIndex]) cancelAnimationFrame(spinFrameIds[reelIndex]);

    const len = reelStrips[reelIndex].length;
    
    // 【修正1】見た目と内部の認識を一致させるため Math.floor を Math.round に変更
    // これにより、プレイヤーが押したと思った図柄とシステムの認識が完全に一致します
    const pressIdx = Math.round(currentPos[reelIndex]) % len;
    
    // 滑り制御を計算して最終停止位置を取得
    const finalIdx = getStopPosition(reelIndex, pressIdx);

    // 停止位置の記録と画面への反映
    targetSymbols[reelIndex] = finalIdx;
    currentSymbols[reelIndex] = finalIdx;
    
    // 【修正2】リールの座標を常に「2周目」に固定する（+ len を追加）
    // これにより、上段がテープ外になって表示が崩れる問題や、役の点滅ズレが解消されます
    currentPos[reelIndex] = finalIdx + len; 
    
    updateReelDisplay(reelIndex, currentPos[reelIndex]);

    // テンパイチェック
    checkTenpaiSound();

    stopCount++;
    document.getElementById('btnStop' + reelIndex).disabled = true;
    document.getElementById('panelStop' + reelIndex).disabled = true;

    // 第3停止時の処理（ねじり判定へ）
    if (stopCount === 3) {
      changeState(STATES.STOPPING);
      isNejiriWait = true;
      isStopAnimFinished = true;
    }
  }
  function releaseStop() {
    if (isAutoPlay && !isAutoSystemCalling) return;
    if (isNejiriWait) {
      isNejiriWait = false; 

      if (isStopAnimFinished) {
        btnStops.forEach(btn => btn.disabled = true);
        panelStops.forEach(btn => btn.disabled = true);
        changeState(STATES.PAYOUT); 
        isStopAnimFinished = false;
        checkWin(); 
      }
    }
  }

  window.addEventListener('pointerup', () => {
    if (isNejiriWait) {
      releaseStop();
    }
  });
  
// ① ページを開いた時などに「あらかじめ音声をメモリに解凍しておく」関数
async function preloadFlashSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (flashAudioBuffer) return; // すでに解凍済みなら何もしない

  try {
    const response = await fetch('bgm/flash.mp3'); // ※実際のファイルパスに合わせてください
    const arrayBuffer = await response.arrayBuffer();
    flashAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    console.log("ペカり音：RAMへの装填完了。いつでも爆速で鳴らせます");
  } catch (e) {
    console.error("ペカり音のメモリ展開に失敗:", e);
  }
}

// ② ペかる瞬間に呼ばれる「ゼロ遅延・発射」関数
function playFlashZeroLatency() {
  // 1. メモリ展開（Web Audio API）が成功している場合の処理
  if (audioCtx && flashAudioBuffer) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const source = audioCtx.createBufferSource();
    source.buffer = flashAudioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
  } 
  // 2. ローカル環境などでメモリ展開が失敗していた場合の予備処理
  else {
    sndFlash.currentTime = 0;
    const playPromise = sndFlash.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("ペカり音の再生がブロックされました:", error);
      });
    }
  }
}

// ★追記：2リール停止時に7がテンパイしているか判定して音を鳴らす関数
  function checkTenpaiSound() {
    // 有効5ラインの定義
    const LINES = [
      [0, 0, 0], // 上段
      [1, 1, 1], // 中段
      [2, 2, 2], // 下段
      [0, 1, 2], // 右下がり
      [2, 1, 0]  // 右上がり
    ];

    // 3つのリールの出目の状態を再現（回転中のリールは null になる）
    const board = [null, null, null];
    for (let r = 0; r < 3; r++) {
      if (!isSpinning[r]) {
        const tIdx = targetSymbols[r];
        const len = reelStrips[r].length;
        board[r] = [
          reelStrips[r][(tIdx - 1 + len) % len], // 上段
          reelStrips[r][tIdx],                   // 中段
          reelStrips[r][(tIdx + 1) % len]        // 下段
        ];
      }
    }

     let isTenpai = false;

    
    LINES.forEach(line => {
      const s0 = board[0] ? board[0][line[0]] : null;
      const s1 = board[1] ? board[1][line[1]] : null;
      const s2 = board[2] ? board[2][line[2]] : null;

      const symbolsInLine = [s0, s1, s2];
      const sevenCount = symbolsInLine.filter(s => s === '7').length;
      const nullCount = symbolsInLine.filter(s => s === null).length;

      // 7が2点灯（テンパイ状態）かつ、まだ1リールが回転中の場合
      if (sevenCount === 2 && nullCount === 1) {
     
        isTenpai = true; 
      }
    });

    if (isTenpai) {
      sndTenpai.currentTime = 0;
      sndTenpai.play().catch(e => console.log("テンパイ音再生ブロック:", e));
    }
  }

function checkWin() {
  if (currentState !== STATES.PAYOUT) return;

  let pay = 0;
  let isLineWon = false;
  let isReachWon = false;
  let isBonusWon = false;
  let isGrapeWon = false;
  let isReplayWon = false;
  let isBellWon = false;
  let isClownWon = false;
  let wonLines = []; 

  const len0 = reelStrips[0].length;
  const len1 = reelStrips[1].length;
  const len2 = reelStrips[2].length;

  const leftTop = reelStrips[0][(currentSymbols[0] - 1 + len0) % len0];
  const leftMid = reelStrips[0][currentSymbols[0]];
  const leftBot = reelStrips[0][(currentSymbols[0] + 1) % len0];
  
  const centerTop = reelStrips[1][(currentSymbols[1] - 1 + len1) % len1];
  const centerMid = reelStrips[1][currentSymbols[1]];
  const centerBot = reelStrips[1][(currentSymbols[1] + 1) % len1];
  
  const rightTop = reelStrips[2][(currentSymbols[2] - 1 + len2) % len2];
  const rightMid = reelStrips[2][currentSymbols[2]];
  const rightBot = reelStrips[2][(currentSymbols[2] + 1) % len2];

  let isSingleCherry = false; 

  const lines = [
    [leftTop, centerTop, rightTop],
    [leftMid, centerMid, rightMid],
    [leftBot, centerBot, rightBot],
    [leftTop, centerMid, rightBot],
    [leftBot, centerMid, rightTop]
  ];
   let activeLineIndices = [];
if (activeBet === 1) activeLineIndices = [1];
else if (activeBet === 2) activeLineIndices = [0, 1, 2];
else activeLineIndices = [0, 1, 2, 3, 4];

  const lineIndices = [
    [0, 0, 0], 
    [1, 1, 1], 
    [2, 2, 2], 
    [0, 1, 2], 
    [2, 1, 0]  
  ];

  let isCustomReachWon = false; 
  const customReachPatterns = [
    ['bar', 'bar', 'bar'],
    ['bar', 'bar', '7'],
    ['7', 'bar', '7'],
    ['7', 'bar', 'bar'],
    ['bar', '7', '7'],
    ['bar', '7', 'bar'],
    ['clown', '7', 'clown'],
    ['clown', 'bar', 'clown']
  ];

  // 各有効ラインの図柄判定
  lines.forEach((line, lineIdx) => {
    if (!activeLineIndices.includes(lineIdx)) return;
    const [s1, s2, s3] = line;
    let currentLineWon = false;
    
    customReachPatterns.forEach(pattern => {
      if (s1 === pattern[0] && s2 === pattern[1] && s3 === pattern[2]) {
        isCustomReachWon = true;
      }
    });

    // --- 【修正】ボーナス揃い判定のロジック緩和と確定処理 ---
    if (s1 === '7' && s2 === '7' && s3 === '7') {
      // 777が揃った場合、内部ボーナス成立中（またはBIG関連フラグ）かつボーナス中でなければBIG開始
      const isBigReady = isBonusInternal || currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.MIDDLE_CHERRY;
      if (isBigReady && bonusPayoutRemaining <= 0) {
        isBonusWon = true;
        currentLineWon = true;
        isLineWon = true;
        currentBonusType = FLAGS.BIG;
        bonusPayoutRemaining = 280;
        maxBonusPayout = 280;
        bonusTotalPayout = 0;
        isBonusInternal = false;
      }
    } else if (s1 === '7' && s2 === '7' && s3 === 'bar') {
      // 77barが揃った場合、内部ボーナス成立中（またはREG関連フラグ）かつボーナス中でなければREG開始
      const isRegReady = isBonusInternal || currentGameFlag === FLAGS.REG || currentGameFlag === FLAGS.CHERRY_REG;
      if (isRegReady && bonusPayoutRemaining <= 0) {
        isBonusWon = true;
        currentLineWon = true;
        isLineWon = true;
        currentBonusType = FLAGS.REG;
        bonusPayoutRemaining = 98;
        maxBonusPayout = 98;
        bonusTotalPayout = 0;
        isBonusInternal = false;
      }
    } else if (s1 === 'grape' && s2 === 'grape' && s3 === 'grape') {
      // ボーナス中か通常時かで払い出しを分ける
      if (bonusPayoutRemaining > 0) {
        pay += (activeBet === 1) ? 8 : 14; // ボーナス中は1枚掛けで8枚、2枚掛けで14枚
      } else {
        pay += (activeBet === 2) ? 14 : 7; // 通常時の処理
      }
      isGrapeWon = true;
      currentLineWon = true;
      isLineWon = true;
    } else if (s1 === 'replay' && s2 === 'replay' && s3 === 'replay') {
      if (bonusPayoutRemaining <= 0) {
        isReplayWon = true;
        currentLineWon = true;
        isLineWon = true;
      }
    } else if (s1 === 'bell' && s2 === 'bell' && s3 === 'bell') {
      if (bonusPayoutRemaining <= 0) {
        pay += 14;
        isBellWon = true;
        currentLineWon = true;
        isLineWon = true;
      }
    } else if (s1 === 'clown' && s2 === 'clown' && s3 === 'clown') {
      if (bonusPayoutRemaining <= 0) {
        pay += 10;
        isClownWon = true;
        currentLineWon = true;
        isLineWon = true;
      }
    }

    if (!isBonusWon && bonusPayoutRemaining <= 0) {
      REACH_PATTERNS.forEach(pattern => {
        if (s1 === pattern[0] && s2 === pattern[1] && s3 === pattern[2]) {
          isReachWon = true;
        }
      });
    }

    if (currentLineWon) wonLines.push(lineIdx);
  });

   // --- 【修正版】チェリー（角チェリー＆中段チェリー）の判定と払い出し処理 ---
  let isCherryWon = false;
  let isTanCherry = false; // ▼ 単チェリー判定用フラグを追加

  if (activeBet === 1 && leftMid === 'cherry') isCherryWon = true; 
  if (activeBet >= 2 && (leftTop === 'cherry' || leftMid === 'cherry' || leftBot === 'cherry')) isCherryWon = true; 

  if (isCherryWon) {
    const isMinorRoleWon = isGrapeWon || isReplayWon || isBellWon || isClownWon;
    
    // ▼ 単チェリーの視覚的判定（中リールにチェリーが止まっていないか）
    const centerHasCherry = centerTop === 'cherry' || centerMid === 'cherry' || centerBot === 'cherry';
    if (!centerHasCherry) {
      isTanCherry = true; // 中リールにチェリーがいなければ実機同様「単チェリー」
    }

    if (!isMinorRoleWon) {
      if (bonusPayoutRemaining > 0) {
        pay += (activeBet === 1) ? 8 : 14; 
      } else {
        pay += 2;
      }
      isLineWon = true;
      
      const tape0 = document.getElementById('reelTape0');
      const offset = -1;
      const totalCells = reelStrips[0].length * 3;
      let cherryOffset = 0;

      if (leftTop === 'cherry') cherryOffset = 0;
      else if (leftMid === 'cherry') cherryOffset = 1;
      else if (leftBot === 'cherry') cherryOffset = 2;

      const cellIndex = (Math.round(currentPos[0]) + cherryOffset + offset + totalCells) % totalCells;
      const img = tape0.children[cellIndex]?.querySelector('img');
      if (img) img.classList.add('blink-anim');
    }

    // --- 通常時のチェリー重複・単チェリー確定処理 ---
    if (bonusPayoutRemaining <= 0) {
      // 実機同様、内部フラグが重複チェリーの場合のみボーナスを確定させる
      // ※リール制御(getStopPosition)側で、重複時は強制的に単チェリー(非テンパイ)になり、通常時は連チェリーになります。
      if (currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.CHERRY_REG || currentGameFlag === FLAGS.MIDDLE_CHERRY) {
        if (!isBonusInternal) {
          isBonusInternal = true;
          internalBonusType = (currentGameFlag === FLAGS.CHERRY_REG) ? FLAGS.REG : FLAGS.BIG;
        }
        // 重複フラグ時はリーチ目（ペカり）扱いにする
        isReachWon = true; 
      }
    }
  }

  // 小役ラインの点滅処理
  wonLines.forEach(lineIdx => {
    const indices = lineIndices[lineIdx];
    for (let i = 0; i < 3; i++) {
      const tape = document.getElementById('reelTape' + i);
      const offset = -1;
      const totalCells = reelStrips[i].length * 3;
      const cellIndex = (Math.round(currentPos[i]) + indices[i] + offset + totalCells) % totalCells;
      const img = tape.children[cellIndex]?.querySelector('img');
      if (img) img.classList.add('blink-anim');
    }
  });

  // 独自定義のリーチ目パターンもリーチ目として扱う
  if (isCustomReachWon) {
    isReachWon = true;
    // 視覚的にリーチ目が止まった場合、問答無用で内部ボーナスを確定させる
    if (!isBonusInternal && bonusPayoutRemaining <= 0) {
      isBonusInternal = true;
      internalBonusType = Math.random() < 0.5 ? FLAGS.BIG : FLAGS.REG; // リーチ目時はBIG/REGをランダム設定
    }
  }
     if (isBonusWon) {
    // ▼ 追加: ボーナスが揃ったゲーム数とレインボー状態を保持
    const wonGameCount = displayGameCount; 
    const isRainbow = gogoLamp.classList.contains('rainbow'); 

    displayGameCount = 0;
    gogoLamp.className = 'gogo-lamp'; // ランプの状態クラスをリセット
    isBonusInternal = false;

    if (currentBonusType === FLAGS.BIG) {
      // ▼▼ 追加：プレミアムBGMの条件判定とsrc書き換え ▼▼
      let startBgm = 'bgm/startbonus.mp3';
      let bigBgm = 'bgm/bigbonus.mp3';
      let finishBgm = 'bgm/bonusfinish.mp3';

      // ① CHANCEレインボー点灯時
      if (isRainbow) {
        // 【パターンA: Will】 にする場合はこちらを有効にしてください
        /*
        startBgm = 'bgm/willstart.mp3';
        bigBgm = 'bgm/will.mp3';
        finishBgm = 'bgm/willfinish.mp3';
        */

        // 【パターンB: Revo】 にする場合はこちらを有効にしてください（デフォルト）
        // ※revo.mp3 は280枚払い出しまでループ再生され、終了音は鳴らしません
        startBgm = 'bgm/revostart.mp3';
        bigBgm = 'bgm/revo.mp3';
        finishBgm = null; 
      } 
      // ② ボーナス後1ゲームで当選 (1G連)
      else if (wonGameCount === 1) {
        startBgm = 'bgm/sp1start.mp3';
        bigBgm = 'bgm/spacial1.mp3';
        finishBgm = 'bgm/sp1finish.mp3';
      } 
      // ③ ボーナス終了後2G～5G以内に当選
      else if (wonGameCount >= 2 && wonGameCount <= 5) {
        startBgm = 'bgm/9start.mp3';
        bigBgm = 'bgm/9.mp3';
        finishBgm = 'bgm/9finish.mp3';
      } 
      // ④ 100G以内のゾロ目G数で当選 (11, 22, 33... 99)
      else if (wonGameCount > 0 && wonGameCount <= 99 && wonGameCount % 11 === 0) {
        startBgm = 'bgm/dstart.mp3';
        bigBgm = 'bgm/d.mp3';
        finishBgm = 'bgm/dfinish.mp3';
      }

      // 判定した音声を実際のAudioオブジェクトにセット
      sndStartBonus.src = startBgm;
      sndBigBonus.src = bigBgm;
      if (finishBgm) {
        sndBonusFinish.src = finishBgm;
      } else {
        sndBonusFinish.removeAttribute('src');       }

      // ▼ BIGの場合: ファンファーレ再生後、終了を検知してBIG BGMを再生
      sndStartBonus.currentTime = 0;
      const playPromise = sndStartBonus.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => console.warn("BGMブロック:", e));
      }

      // ファンファーレ(startbonus.mp3)が鳴り終わった直後に発火
      sndStartBonus.onended = () => {
        sndBigBonus.currentTime = 0;
        sndBigBonus.play().catch(e => console.warn("BIG BGMブロック:", e));
      };

    } else if (currentBonusType === FLAGS.REG) {
      // ▼ REGの場合: ファンファーレは鳴らさず、即座にREG BGMを再生
      sndRegBonus.currentTime = 0;
      sndRegBonus.play().catch(e => console.warn("REG BGMブロック:", e));
    }
  }

  if (isReplayWon) {
    sndReplay.currentTime = 0;
    sndReplay.play();
    betAmount = 3;
    indReplay.classList.add('on');
  }

  if (
    bonusPayoutRemaining <= 0 &&
    !isBonusWon &&
    (currentFlag === 5 || isBonusInternal) &&
    !gogoLamp.classList.contains('on') &&
    !gogoLamp.classList.contains('rainbow') &&
    !gogoLamp.classList.contains('premium-only-gogo') &&
    !gogoLamp.classList.contains('premium-only-chance')
  ) {
    playFlashZeroLatency();
    
    if (internalBonusType === FLAGS.BIG) {
      // BIG確定時のプレミア振り分け (先告知と同じ確率設定)
      const premiumRand = Math.random();
      if (premiumRand < 0.05) {
        gogoLamp.classList.add('rainbow');
      } else if (premiumRand < 0.10) {
        gogoLamp.classList.add('premium-only-gogo');
      } else if (premiumRand < 0.15) {
        gogoLamp.classList.add('premium-only-chance');
      } else {
        gogoLamp.classList.add('on'); // 通常点灯
      }
    } else {
      // REGの場合は必ず通常点灯
      gogoLamp.classList.add('on');
    }
  }

  // isBonusWon（ボーナスを揃えたゲーム）ではない場合のみ加算・減算する
  if (bonusPayoutRemaining > 0 && !isBonusWon) {
    bonusPayoutRemaining -= pay;
    bonusTotalPayout += pay;
    if (bonusPayoutRemaining <= 0) {
      isBonusEnding = true;
    }
  }

  const finalizeCheckWin = () => {
    updateDisplay();
    stopCount = 0;
    if (gameCount > 0 && gameCount % 10 === 0 && lastGraphUpdateGame !== gameCount) {
      slumpData.push({ game: gameCount, diff: currentDiff });
      lastGraphUpdateGame = gameCount;
    }
    
    if (!isBonusEnding) {
      if (isReplayWon) {
        changeState(STATES.BET);
        updateBetLamps(3);
      } else {
        changeState(STATES.IDLE);
        updateBetLamps(0);
      }
    } else {
      isBonusEnding = false;
      const endedBonusType = currentBonusType;
      currentBonusType = null;
      
      if (endedBonusType === FLAGS.BIG) {
        bbCount++;
      } else if (endedBonusType === FLAGS.REG) {
        rbCount++;
      }

      // ▼ 追加：終了音を鳴らす前に、再生中のボーナスループBGMを直ちにカット（停止）する
      sndBigBonus.pause();
      sndBigBonus.currentTime = 0;
      sndRegBonus.pause();
      sndRegBonus.currentTime = 0;

      const safeEndState = () => {
            changeState(STATES.IDLE);
            updateBetLamps(0);
            updateDisplay();
          };

          if (endedBonusType === FLAGS.BIG) {
            if (sndBonusFinish.getAttribute('src')) {
              sndBonusFinish.currentTime = 0;
              const playPromise = sndBonusFinish.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  safeEndState();
                });
              }
              sndBonusFinish.onended = safeEndState;
              setTimeout(safeEndState, 4000);
            } else {
              safeEndState();
            }
          } else {
            safeEndState();
          }
        }
      };
    
  

  if (pay > 0) {
    let animPay = pay;
    let animCredits = credits;
    let animHandCoins = handCoins;
    
    // ボーナス中（成立ゲーム以外）なら今回増えた分を引いた値からスタート
    let animTotalPayout = (!isBonusWon && bonusPayoutRemaining > 0) ? (bonusTotalPayout - pay) : bonusTotalPayout;

    sndPayout.currentTime = 0;
    sndPayout.play();
    payoutDisplay.innerText = animPay;
    
    const payoutInterval = setInterval(() => {
      animPay--;
      animCredits++;
      if (animCredits > 50) {
        animCredits = 50;
        animHandCoins++;
      }
      
      // ボーナス揃いのゲーム(!isBonusWon)以外でのみカウントアップを表示する
      if (!isBonusWon && (bonusPayoutRemaining > 0 || isBonusEnding || bonusTotalPayout > 0)) {
        if (animTotalPayout < bonusTotalPayout) {
          animTotalPayout++;
        }
        countDisplay.innerText = animTotalPayout;
      }
      payoutDisplay.innerText = animPay;
      creditDisplay.innerText = animCredits;
      if (handCoinsDisplay) handCoinsDisplay.innerText = animHandCoins;
      document.getElementById('statCoins').innerText = animHandCoins + animCredits;

      if (animPay <= 0) {
        sndPayout.pause();
        sndPayout.currentTime = 0;
        clearInterval(payoutInterval);
        credits = animCredits;
        handCoins = animHandCoins;
        finalizeCheckWin();
      }
    }, 130);
  } else {
    finalizeCheckWin();
  }
 }
  
  
    
  function resetBet() {
    if (isAutoPlay && !isAutoSystemCalling) return;
    // BETされている場合のみクレジットに戻す
    if (betAmount > 0) {
      credits += betAmount; 
      if (credits > 50) {
        handCoins += (credits - 50); // 50枚を超えた分だけ所持枚数へ
        credits = 50;
      }
      betAmount = 0;       
      updateDisplay();     
      updateBetLamps(0);  
      changeState(STATES.IDLE); 
    }
  }
function updateBetLamps(amount) {
  const b1 = document.getElementById('betLamp1');
  const b2 = document.getElementById('betLamp2');
  const b3 = document.getElementById('betLamp3');

  // 一旦すべて消灯
  if(b1) b1.classList.remove('on');
  if(b2) b2.classList.remove('on');
  if(b3) b3.classList.remove('on');

  // 1枚掛け→下1つ、2枚掛け→下2つ、3枚掛け→下3つ点灯
  if (amount >= 1 && b1) b1.classList.add('on');
  if (amount >= 2 && b2) b2.classList.add('on');
  if (amount >= 3 && b3) b3.classList.add('on');
}

  function bet() {
    unlockAudio();

    // 必要枚数の決定（通常時は3枚、ボーナス中は2枚）
    let requiredMedals = 3; 
    if (bonusPayoutRemaining > 0) { 
      requiredMedals = 2;   
    }

    // 【補給処理】クレジットが必要枚数未満の場合、手持ちの所持枚数（handCoins）から優先的に補充
    if (credits < requiredMedals) {
      if (handCoins > 0) {
        // クレジットの上限50枚まで、または手持ちの全枚数を補充
        let fillAmount = Math.min(50 - credits, handCoins);
        credits += fillAmount;
        handCoins -= fillAmount;
        updateDisplay(); // 補給後の枚数を画面に反映
      }
    }

    // 【入金判定】補充してもなお必要枚数に満たない（完全に0枚など）場合は入金モーダルを開く
    if (credits < requiredMedals) {
      openDepositModal();
      return;
    }
    
    if (currentState === STATES.BET) return;
    
    if (bonusPayoutRemaining <= 0 && !isBonusEnding) {
      bonusTotalPayout = 0;
    }

    credits -= requiredMedals;
    betAmount = requiredMedals;
    currentDiff -= requiredMedals;
    updateBetLamps(requiredMedals);
    payoutDisplay.innerText = 0; 
    updateDisplay();
    changeState(STATES.BET); 
    sndMaxBet.currentTime = 0;
    sndMaxBet.play();
  }

  function betSingle() {
    if (isAutoPlay && !isAutoSystemCalling) return;
     
    unlockAudio();
    
    if (bonusPayoutRemaining <= 0 && !isBonusEnding) {
      bonusTotalPayout = 0;
    }

    let requiredMedals = 1;

    // 【補給処理】クレジットが必要枚数未満の場合、手持ちの所持枚数（handCoins）から優先的に補充
    if (credits < requiredMedals) {
      if (handCoins > 0) {
        let fillAmount = Math.min(50 - credits, handCoins);
        credits += fillAmount;
        handCoins -= fillAmount;
        updateDisplay(); // 補給後の枚数を画面に反映
      }
    }

    // 【入金判定】補充してもなお1枚も無い場合は入金モーダルを開く
    if (credits < requiredMedals) {
      openDepositModal();
      return;
    }

    credits -= requiredMedals;
    betAmount = requiredMedals;
    currentDiff -= requiredMedals;
    updateBetLamps(requiredMedals);
    payoutDisplay.innerText = 0;
    updateDisplay();
    changeState(STATES.BET);
    sndMaxBet.currentTime = 0;
    sndMaxBet.play();
  }

   window.addEventListener('DOMContentLoaded', () => {
  simulateInitialGames(4000);
  // 追加：初期座標を2周目の領域にセットする
  currentPos = [
    currentSymbols[0] + reelStrips[0].length,
    currentSymbols[1] + reelStrips[1].length,
    currentSymbols[2] + reelStrips[2].length
  ];
  
  changeState(STATES.IDLE);
  indInsertMedals.classList.add('on');
  for (let i = 0; i < 3; i++) updateReelDisplay(i, currentPos[i]);
  openDepositModal();
});

  // キーボード操作の対応
  window.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault(); 
        if (!btnBet.disabled) {
          bet();
        }
        break;

      case '1':
      case '１': // 全角入力時にも対応
        event.preventDefault();
        // 1枚掛けボタンが有効な時だけ実行する
        if (!btnSingleBet.disabled) {
          betSingle();
        }
        break;

      case '0':
      case '０': // 全角入力時にも対応
        event.preventDefault();
        resetBet();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!btnStart.disabled) {
          startSpin();
        }
        break;

        case ' ':
        event.preventDefault();
        if (isSpinning[0]) {
          stopSpin(0);
        } else if (isSpinning[1]) {
          stopSpin(1);
        } else if (isSpinning[2]) {
          stopSpin(2);
        }
        break;

      case 'm':
      case 'M':
        openStatistics();
        break;
      case 's':
      case 'S':
        openSetting();
        break;
    }
 });

  window.addEventListener('keyup', (event) => {
    if (event.key === ' ' && isNejiriWait) {
      releaseStop();
    }
  });

// HTMLの onclick / onpointerdown から呼び出せるようにグローバルに登録
window.bet = bet;
window.betSingle = betSingle;
window.resetBet = resetBet;
window.startSpin = startSpin;
window.stopSpin = stopSpin;
window.releaseStop = releaseStop;
window.openSetting = openSetting;
window.closeSetting = closeSetting;
window.changeSetting = changeSetting;
window.openStatistics = openStatistics;
window.closeStatistics = closeStatistics;

function initReelTapes() {
  for (let i = 0; i < 3; i++) {
    const tape = document.getElementById('reelTape' + i);
    tape.innerHTML = ''; 
    
    const strip = reelStrips[i];
    // シームレスループのため「3周分（63コマ）」を繋げて配置する
    const tripleStrip = [...strip, ...strip, ...strip];
    const totalCells = tripleStrip.length;
    
    // テープ全体の高さを更新
    tape.style.height = `${(totalCells / 3) * 100}%`;

    for (let j = 0; j < totalCells; j++) {
      const symbolName = tripleStrip[j];
      const cell = document.createElement('div');
      cell.className = 'reel-cell';
      
      // CSSの calc(100%/23) をJavaScript側から正しい高さで上書き
      cell.style.height = `${100 / totalCells}%`;
      
      const img = document.createElement('img');
      img.src = symbolImages[symbolName];

      if (symbolName === '7') {
        img.classList.add('glow-seven-img');
      } else if (symbolName === 'bar') {
        img.classList.add('bar-img');
      } else if (symbolName === 'grape') {
        img.classList.add('grape-img');
      } else if (symbolName === 'cherry') {
        img.classList.add('cherry-img');
      } else if (symbolName === 'bell') {
        img.classList.add('bell-img');
      } else if (symbolName === 'replay') {
        img.classList.add('replay-img');
      } else if (symbolName === 'clown') {
        img.classList.add('clown-img');
      }
      
      cell.appendChild(img);
      tape.appendChild(cell);
    }
  }
}
// ページ読み込み完了と同時に、長いテープを仕込む
document.addEventListener('DOMContentLoaded', () => {
  initReelTapes();
});

// --- 4000Gシミュレーション関数 ---
function simulateInitialGames(simCount) {
  for (let i = 0; i < simCount; i++) {
    gameCount++;
    const rand = Math.floor(Math.random() * 65536);
    let prob = PROBABILITY_TABLE[currentSettingLevel];
    
    let flag = FLAGS.HAZURE;
    let acc = 0;
    const hit = (p, f) => {
      acc += p;
      if (flag === FLAGS.HAZURE && rand < acc) flag = f;
    };
    
    hit(prob.big, FLAGS.BIG);
    hit(prob.c_big, FLAGS.CHERRY_BIG);
    hit(prob.reg, FLAGS.REG);
    hit(prob.c_reg, FLAGS.CHERRY_REG);
    hit(prob.grape, FLAGS.GRAPE);
    hit(prob.replay, FLAGS.REPLAY);
    hit(prob.cherry, FLAGS.CHERRY);
    hit(prob.bell, FLAGS.BELL);
    hit(prob.clown, FLAGS.CLOWN);

    currentDiff -= 3;
    if (flag === FLAGS.BIG || flag === FLAGS.CHERRY_BIG) {
      bbCount++;
      currentDiff += 280;
      displayGameCount = 0;
    } else if (flag === FLAGS.REG || flag === FLAGS.CHERRY_REG) {
      rbCount++;
      currentDiff += 98;
      displayGameCount = 0;
    } else if (flag === FLAGS.GRAPE) {
      currentDiff += 7;
      displayGameCount++;
    } else if (flag === FLAGS.REPLAY) {
      currentDiff += 3;
      displayGameCount++;
    } else if (flag === FLAGS.CHERRY) {
      currentDiff += 2;
      displayGameCount++;
    } else if (flag === FLAGS.BELL) {
      currentDiff += 14;
      displayGameCount++;
    } else if (flag === FLAGS.CLOWN) {
      currentDiff += 10;
      displayGameCount++;
    } else {
      displayGameCount++;
    }

    if (gameCount % 10 === 0) {
      slumpData.push({ game: gameCount, diff: currentDiff });
    }
  }
  lastGraphUpdateGame = gameCount;
  
  // 修正箇所: 以下の処理を削除し、シミュレーションでの獲得枚数を初期所持コインに反映させないようにしました
  // if (currentDiff > 0) handCoins += currentDiff;
}

// --- オートプレイ切り替え ---
function toggleAutoPlay() {
  isAutoPlay = !isAutoPlay;
  const autoBtn = document.getElementById('autoBtn');
  if (isAutoPlay) {
    autoBtn.src = 'image/autoon.png';
    runAutoPlay();
  } else {
    autoBtn.src = 'image/auto.png';
    clearTimeout(autoPlayTimer);
  }
}
window.toggleAutoPlay = toggleAutoPlay;

 // --- オートプレイループ ---
function runAutoPlay() {
  if (!isAutoPlay) return;
  isAutoSystemCalling = true; 
  let nextDelay = 100;

  if (currentState === STATES.IDLE) {
    btnBet.click(); 
    nextDelay = 200;

  } else if (currentState === STATES.BET) {
    startSpin();
    nextDelay = 200;

  } else if (currentState === STATES.SPIN || currentState === STATES.STOPPING) {
    
    const isInternalBig = (isBonusInternal && internalBonusType === FLAGS.BIG) || 
                          (currentGameFlag === FLAGS.BIG || currentGameFlag === FLAGS.CHERRY_BIG || currentGameFlag === FLAGS.MIDDLE_CHERRY);
    const isInternalReg = (isBonusInternal && internalBonusType === FLAGS.REG) || 
                          (currentGameFlag === FLAGS.REG || currentGameFlag === FLAGS.CHERRY_REG);
    const isBonus = isInternalBig || isInternalReg;

    if (isSpinning[0]) {
      if (isBonus) {
        if (autoAim(0, '7')) {
          stopSpin(0);
          nextDelay = 200;
        } else {
          nextDelay = 5; // ★5ms間隔に高速化してビタのタイミングを逃さない
        }
      } else {
        // ★【修正】通常時もアバウトな判定をやめ、autoAimでチェリーを狙う
        if (autoAim(0, 'cherry')) {
          stopSpin(0);
          nextDelay = 200;
        } else {
          nextDelay = 5; // ★5ms間隔に高速化
        }
      }

    } else if (isSpinning[1]) {
      if (isBonus) {
        if (autoAim(1, '7')) {
          stopSpin(1);
          nextDelay = 200;
        } else {
          nextDelay = 5; // ★5ms間隔に高速化
        }
      } else {
        stopSpin(1);
        nextDelay = 200;
      }

    } else if (isSpinning[2]) {
      if (isBonus) {
        const target = isInternalReg ? 'bar' : '7';
        if (autoAim(2, target)) {
          stopSpin(2);
          nextDelay = 200;
        } else {
          nextDelay = 5; // ★5ms間隔に高速化
        }
      } else {
        stopSpin(2);
        nextDelay = 200;
      }
      
    } else if (isNejiriWait) {
      releaseStop();
      nextDelay = 500;
    }

  } else if (currentState === STATES.PAYOUT) {
    nextDelay = 500;
  }

  isAutoSystemCalling = false; 
  if (isAutoPlay) {
    autoPlayTimer = setTimeout(runAutoPlay, nextDelay);
  }
}

// 特定の図柄を狙う目押し判定関数
function autoAim(reelIndex, targetSymbol) {
  const len = reelStrips[reelIndex].length;
  // 現在の中段のインデックスを正確に取得
  const pressIdx = Math.round(currentPos[reelIndex]) % len;

  for (let i = 0; i < len; i++) {
    if (reelStrips[reelIndex][i] === targetSymbol) {
      // ターゲット図柄 (i) に対して、現在位置 (pressIdx) がどれくらい進んでいるかを計算
      let diff = (pressIdx - i + len) % len;
      
      // 目押し位置から0〜3コマ手前にターゲットがいれば滑りで確実に引き込める
      if (diff >= 0 && diff <= 3) {
        return true;
      }
    }
  }
  return false;
}
// 手動でメダルを投入する処理（クリック用）
function insertCoinManually() {
  if (handCoins <= 0) return; // 手持ちメダルがない場合は何もしない
  if (currentState !== STATES.IDLE && currentState !== STATES.BET) return; // 回転中などは無効
  if (isAutoPlay && !isAutoSystemCalling) return;

  unlockAudio();

  if (bonusPayoutRemaining <= 0 && !isBonusEnding) {
    bonusTotalPayout = 0;
  }

  // ボーナス中は最大2枚、通常時は最大3枚
  const maxBet = (bonusPayoutRemaining > 0) ? 2 : 3;

  if (betAmount < maxBet) {
    // 1. ベットが上限に達していない場合は直接ベットする
    handCoins--;
    betAmount++;
    currentDiff--;
    updateBetLamps(betAmount);
    changeState(STATES.BET);
    sndMaxBet.currentTime = 0;
    sndMaxBet.play(); // ※チャリンという音があればそれに変更してもOK
  } else if (credits < 50) {
    // 2. ベットが満タンでクレジットに空きがある場合はクレジットに入れる
    handCoins--;
    credits++;
    sndMaxBet.currentTime = 0;
    sndMaxBet.play();
  }

  updateDisplay();
}

// グローバルから呼び出せるように登録
window.insertCoinManually = insertCoinManually;
// 画面の初回タップ時にすべての音声を一斉にアンロックする処理
let isAudioUnlockedGlobal = false;

function unlockAudioGlobal() {
  if (isAudioUnlockedGlobal) return;
  
  // 既存のHTML5 Audioアンロック関数を呼び出し
  unlockAudio();
  
  // Web Audio API (ペカり音など) がサスペンド状態なら復帰させる
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  isAudioUnlockedGlobal = true;
  
  // 一度アンロックしたら不要になるためイベントリスナーを削除
  document.removeEventListener('touchstart', unlockAudioGlobal);
  document.removeEventListener('click', unlockAudioGlobal);
}

// 画面のどこかをタッチまたはクリックした時に実行
document.addEventListener('touchstart', unlockAudioGlobal, { once: true });
document.addEventListener('click', unlockAudioGlobal, { once: true });