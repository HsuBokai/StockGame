# StockGame

## 說明：
這是一款極簡化極陽春的股票模擬遊戲。

玩家初始資金為 $ 600 仟元，遊戲目標是要在 200 天內，透過股票買賣，盡可能放大總資產，
共有 9 檔股票可以買賣，初始股價分別為 $ 30 ~ $ 110 元不等，
點選紅色的 B 小框框即可購買，點選綠色的 S 小框框即可賣出，
玩家做適當的資產分配後，點選左上角 play 按鈕，即可開始模擬。

模擬過程中，這 9 檔股票每天的波動如下：
其中有 3 檔股票會漲，漲幅分別為 +2、+4、+6 元，
其中有 3 檔股票會跌，跌幅分別為 -2、-4、-6 元，
其中有 2 檔股票不漲不跌，最後 1 檔股票會漲 +1 元，
每天隨機排列組合決定漲跌。

## 備註：
1. 買進與賣出都不收取手續費，因此沒有交易成本，可以盡情頻繁交易。
2. 在 play 過程中，所有個股都不允許買賣，但玩家可以點選左上角 Pause 按鈕後，進行買賣來更換持股。
3. 當某一檔個股股價低於或等於 0 元時，不允許買賣。
4. 圖中會顯示 9 檔個股股價表現，以及一條由紅棒和綠棒組成的線，此線為玩家總資產的漲跌表現。
4. 右邊持股明細表格中，NAME 為持股名稱，COUNT 為持股張數，COST 為平均每張持股成本，PROFIT 為該個股目前總收益。
5. 舉例而言，若初始買入 NFLX 一股為 $ 40 元，此時 COUNT:1、COST:40、PROFIT:0。
過一陣子股價跌為 $ 32 元，此時 COUNT:1、COST:40、PROFIT:-8。
再買入 NFLX 一股為 $ 32 元，則 COUNT:2、COST:36、PROFIT:-8。
再過一陣子股價漲為 $ 48 元，此時 COUNT:2、COST:36、PROFIT:24。
再賣出 NFLX 一股為 $ 48 元，此時 COUNT:1、COST:24、PROFIT:24。

## 提示：
對於沒有股票買賣經驗的人來說，可能一開始不知道如何擬定策略。
以下幾個簡單的策略範例，大家可以先嘗試玩玩看：
1. 測略A：所有資金買入最高價的個股，開始跑模擬到結束。
2. 測略B：所有資金買入最低價的個股，開始跑模擬到結束。
3. 策略C：每一檔個股都買 1 張，開始跑模擬到結束。
4. 測略D：平均買入前 5 檔高價股，開始跑模擬到結束。
5. 測略E：平均買入前 5 檔低價股，開始跑模擬到結束。
6. 測略F：前 20 天採用策略E，若總資產增加 $ 40 仟元，則見好就收，賣出低價股，平均分散買入每一檔個股，跑到結束。
若前 20 天不如預期，則認賠殺出，平均分散買入低價股各一張，跑到結束。
